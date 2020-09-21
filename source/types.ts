
import {Subscribe} from "metalshop/dist/toolbox/pubsub.js"
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"

import {makeAppModel} from "./app/make-app-model.js"

export type AppModel = ReturnType<typeof makeAppModel>
export type AppActions = AppModel["actions"]

export type Busy = loading.Load<void>

export interface AppState {
	busy: Busy
	profiles: Profile[]
	invite: InviteLinkPayload
	message: MessageLinkPayload
}

export interface AppUpdateListener {
	(update: AppUpdate): void
}

export interface AppShare {
	onUpdate: Subscribe<AppUpdateListener>
}

export interface ProfileDraft {
	label: string
}

export interface Profile {
	id: string
	label: string
	created: number
	sessions: Session[]
}

export interface SessionDraft {
	profileId: string
	label: string
}

export interface Keys {
	publicKey: JsonWebKey
	privateKey: JsonWebKey
}

export interface Session {
	id: string
	keys: Keys
	label: string
	created: number
}

export interface AppUpdate {
	state: AppState
	actions: AppActions
}

export interface MinimalStorage {
	clear: typeof localStorage.clear
	getItem: typeof localStorage.getItem
	setItem: typeof localStorage.setItem
	removeItem: typeof localStorage.removeItem
}

export interface AppModelParams {
	storage: MinimalStorage
	onUpdate: (update: AppUpdate) => void
}

export interface PsafeDashboardProps {
	busy: Busy
	profiles: Profile[]
	actions: AppActions
}

export interface PsafeWritingDeskProps {
	invite: InviteLinkPayload
}

export interface PsafeReadingRoomProps {
	message: MessageLinkPayload
}

export interface SessionManagerProps {
	ready: boolean
	profileId: string
	sessions: Session[]
	onClickGenerateSession: (draft: SessionDraft) => void
	onClickDeleteSession: (sessionId: string) => void
}

//
// links
//

export interface InviteLinkPayload {
	sessionId: string
	sessionPublicKey: JsonWebKey
}

export interface MessageLinkPayload {
	sessionId: string
	aesCiphertext: string
	messageCiphertext: string
}
