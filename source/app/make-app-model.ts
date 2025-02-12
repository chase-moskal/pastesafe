
import cloneDeep from "lodash-es/cloneDeep.js"
import {makeJsonStorage} from "metalshop/dist/toolbox/json-storage.js"
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"

import {ProfileDraft, SessionDraft, Profile, AppModelParams, Session, AppState, Busy} from "../types.js"

import {hashAny} from "../toolbox/hash.js"
import {randex} from "../toolbox/randex.js"
import {generateSessionKeys} from "../toolbox/xcrypto.js"

import {decodeInviteLink} from "./invite-links.js"
import {decodeMessageLink} from "./message-links.js"

export function makeAppModel({storage, onUpdate}: AppModelParams) {

	//
	// state and actions
	//

	let state: AppState = {
		profiles: [],
		invite: undefined,
		encrypted: undefined,
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
				state: Object.freeze(cloneDeep(state)),
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

	window.addEventListener("storage", (event: StorageEvent) => {
		if (event.storageArea === window.localStorage) {
			refresh()
		}
	})

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

	async function hashChange(link: string) {
		state.invite = decodeInviteLink(link)
		state.encrypted = decodeMessageLink(link)
		triggerUpdate()
	}

	return {
		actions,
		refresh,
		hashChange,
		start: refresh,
	}
}
