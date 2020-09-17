
import {generateId} from "metalshop/dist/toolbox/generate-id.js"

import {copy} from "../toolbox/copy.js"
import {hashAny} from "../toolbox/hash.js"
import {AppState, ProfileDraft, SessionDraft, Profile, AppUpdate, AppModelParams} from "../types.js"

function initializeAppState(): AppState {
	return {
		profiles: [],
		invite: undefined,
	}
}

export function makeAppModel({storage, onUpdate}: AppModelParams) {

	//
	// state and actions
	//

	let state: AppState

	const actions: AppUpdate["actions"] = {
		createProfile(draft: ProfileDraft) {
			const profile: Profile = {
				id: generateId(),
				sessions: [],
				label: draft.label,
			}
			state.profiles.push(profile)
		},
		deleteProfile(profileId: string) {
			state.profiles = state.profiles.filter(({id}) => id !== profileId)
		},
		createSession(draft: SessionDraft) {},
		deleteSession(profileId: string, sessionId: string) {},
	}

	//
	// trigger an app update whenever state has changed
	//

	let previousStateHash: number

	function triggerUpdate() {
		const stateHash = hashAny(state)
		const changed = stateHash !== previousStateHash
		previousStateHash = stateHash
		if (changed) {
			onUpdate({
				actions,
				state: Object.freeze(copy(state)),
			})
		}
	}

	//
	// save/load state from storage
	//

	function save() {
		const dried = JSON.stringify(state)
		storage.setItem("pastesafe", dried)
	}

	function load() {
		let newState: AppState
		const dried = storage.getItem("pastesafe")
		if (dried) {
			try {
				newState = JSON.parse(dried)
			}
			catch (error) {
				console.error(error)
			}
		}
		state = newState || initializeAppState()
	}

	function refresh() {
		load()
		triggerUpdate()
	}

	//
	// wire actions to save state and trigger update
	//

	for (const [key, action] of Object.entries(actions)) {
		actions[key] = (...args: any[]) => {
			action.apply(actions, args)
			save()
			triggerUpdate()
		}
	}

	return {
		actions,
		refresh,
		start: refresh,
		setState(newState: AppState) {
			state = newState
			save()
			triggerUpdate()
		},
	}
}
