
import {makeJsonStorage} from "metalshop/dist/toolbox/json-storage.js"

import {copy} from "../toolbox/copy.js"
import {randex} from "../toolbox/randex.js"
import {hashAny} from "../toolbox/hash.js"
import {ProfileDraft, SessionDraft, Profile, AppModelParams, Session, AppState} from "../types.js"

import {generateKeys} from "./xcrypto.js"

export function makeAppModel({storage, onUpdate}: AppModelParams) {

	//
	// state and actions
	//

	let state: AppState = {
		profiles: [],
		invite: undefined,
	}

	const actions = {

		async createProfile(draft: ProfileDraft) {
			const profile: Profile = {
				id: randex(),
				sessions: [],
				label: draft.label,
				created: Date.now(),
			}
			state.profiles.push(profile)
		},

		async deleteProfile(profileId: string) {
			state.profiles = state.profiles.filter(({id}) => id !== profileId)
		},

		async clearProfiles() {
			state.profiles = []
		},

		async createSession(draft: SessionDraft) {
			const session: Session = {
				id: randex(),
				label: draft.label,
				created: Date.now(),
				keys: await generateKeys(),
			}
			const profile = state.profiles.find(p => p.id === draft.profileId)
			profile.sessions.push(session)
		},

		async deleteSession(profileId: string, sessionId: string) {},
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

	const jsonStore = makeJsonStorage(storage)

	function save() {
		jsonStore.write("pastesafe_profiles", state.profiles)
	}

	function load() {
		state.profiles = jsonStore.read("pastesafe_profiles") || []
	}

	function refresh() {
		load()
		triggerUpdate()
	}

	//
	// wire actions to save state and trigger update
	//

	for (const [key, action] of Object.entries(actions)) {
		actions[key] = async(...args: any[]) => {
			const results = await action.apply(actions, args)
			save()
			triggerUpdate()
			return results
		}
	}

	return {
		actions,
		refresh,
		start: refresh,
	}
}
