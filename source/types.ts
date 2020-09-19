
import {Subscribe} from "metalshop/dist/toolbox/pubsub.js"
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"

import {makeAppModel} from "./app/make-app-model.js"

export type AppModel = ReturnType<typeof makeAppModel>

export type Busy = loading.Load<void>

export interface AppState {
	busy: Busy
	invite: {}
	profiles: Profile[]
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
	actions: AppModel["actions"]
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

export interface SessionManagerProps {
	ready: boolean
	profileId: string
	sessions: Session[]
	onClickGenerateSession: (draft: SessionDraft) => void
	onClickDeleteSession: (sessionId: string) => void
}
