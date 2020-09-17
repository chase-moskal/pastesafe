
import {generateId} from "metalshop/dist/toolbox/generate-id.js"

import {copy} from "../toolbox/copy.js"
import {hashAny} from "../toolbox/hash.js"
import {AppState, ProfileDraft, SessionDraft, Profile, AppUpdate} from "../types.js"

function initializeAppState(): AppState {
	return {
		profiles: [],
		invite: undefined,
	}
}

export function makeApplication({storage, onUpdate}: {
		storage: Storage
		onUpdate: (update: AppUpdate) => void
	}) {

	//
	// state
	//

	let previousStateHash: number
	let state: AppState

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
		state = newState
			? newState
			: initializeAppState()
	}

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

	function refresh() {
		load()
		triggerUpdate()
	}

	//
	// actions that can change state
	//

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
	// triggering app update from state changes
	//

	

	// wire actions to trigger updates
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
