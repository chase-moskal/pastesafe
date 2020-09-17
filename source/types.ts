
import {makeAppModel} from "./app/make-app-model.js"
import {Subscribe} from "metalshop/dist/toolbox/pubsub.js"

export type AppModel = ReturnType<typeof makeAppModel>

export interface AppState {
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
	sessions: Session[]
}

export interface SessionDraft {
	profileId: string
	label: string
}

export interface Session {
	id: string
	label: string
	link: string
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
