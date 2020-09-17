
import {makeJsonStorage} from "metalshop/dist/toolbox/json-storage.js"

import {copy} from "../toolbox/copy.js"
import {randex} from "../toolbox/randex.js"
import {hashAny} from "../toolbox/hash.js"
import {AppState, ProfileDraft, SessionDraft, Profile, AppModelParams} from "../types.js"

export function makeAppModel({storage, onUpdate}: AppModelParams) {

	//
	// state and actions
	//

	let state = {
		profiles: [],
		invite: undefined,
	}

	const actions = {
		async createProfile(draft: ProfileDraft) {
			const profile: Profile = {
				id: randex(),
				sessions: [],
				label: draft.label,
			}
			state.profiles.push(profile)
		},
		async deleteProfile(profileId: string) {
			state.profiles = state.profiles.filter(({id}) => id !== profileId)
		},
		async clearProfiles() {
			state.profiles = []
		},
		async createSession(draft: SessionDraft) {},
		async deleteSession(profileId: string, sessionId: string) {},
	}

	//
	// trigger an app update whenever state has changed
	//

	let previousStateHash: number

	function triggerUpdate() {
		console.debug("triggerUpdate")
		const stateHash = hashAny(state)
		const changed = stateHash !== previousStateHash
		previousStateHash = stateHash
		if (changed) {
			console.debug("state change update")
			onUpdate({
				actions,
				state: Object.freeze(copy(state)),
			})
		}
	}

	//
	// save/load state from storage
	//

	const jsonStore = makeJsonStorage(storage)

	function save() {
		console.debug("save")
		jsonStore.write("pastesafe_profiles", state.profiles)
	}

	function load() {
		console.debug("load")
		state.profiles = jsonStore.read("pastesafe_profiles") || []
	}

	function refresh() {
		console.debug("refresh")
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
			console.debug("set state")
			state = newState
			save()
			triggerUpdate()
		},
	}
}
