
import {makeJsonStorage} from "metalshop/dist/toolbox/json-storage.js"
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"

import {ProfileDraft, SessionDraft, Profile, AppModelParams, Session, AppState, Busy} from "../types.js"

import {copy} from "../toolbox/copy.js"
import {hashAny} from "../toolbox/hash.js"
import {randex} from "../toolbox/randex.js"
import {generateSessionKeys} from "../toolbox/xcrypto.js"

import {decodeInviteLink} from "./links.js"

export function makeAppModel({storage, onUpdate}: AppModelParams) {

	//
	// state and actions
	//

	let state: AppState = {
		profiles: [],
		invite: undefined,
		message: undefined,
		busy: loading.ready(),
	}

	const actions = {
		setBusy(busy: Busy) {
			state.busy = busy
		},

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
			state.profiles = state.profiles.filter(p => p.id !== profileId)
		},

		async clearProfiles() {
			state.profiles = []
		},

		async createSession(draft: SessionDraft) {
			actions.setBusy(loading.loading())
			const session: Session = {
				id: randex(),
				label: draft.label,
				created: Date.now(),
				keys: await generateSessionKeys(),
			}
			const profile = state.profiles.find(p => p.id === draft.profileId)
			profile.sessions.push(session)
			actions.setBusy(loading.ready())
		},

		async deleteSession(profileId: string, sessionId: string) {
			const profile = state.profiles.find(p => p.id === profileId)
			profile.sessions = profile.sessions.filter(s => s.id !== sessionId)
		},
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

	const broadcast = new BroadcastChannel("pastesafe_events")
	const jsonStore = makeJsonStorage(storage)
	const changeMessage = "PASTESAFE_CHANGE"

	function save() {
		jsonStore.write("pastesafe_profiles", state.profiles)
		broadcast.postMessage(changeMessage)
	}

	function load() {
		state.profiles = jsonStore.read("pastesafe_profiles") || []
	}

	function refresh() {
		load()
		triggerUpdate()
	}

	broadcast.onmessage = (event: MessageEvent) => {
		if (event.data === changeMessage) {
			refresh()
		}
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

	//
	// handle link change
	//

	function hashChange(link: string) {
		state.invite = decodeInviteLink(link)
		triggerUpdate()
	}

	return {
		actions,
		refresh,
		hashChange,
		start: refresh,
	}
}
