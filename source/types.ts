
export interface AppState {
	invite: {}
	profiles: Profile[]
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
	actions: {
		createProfile(draft: ProfileDraft): void
		deleteProfile(profileId: string): void
		createSession(draft: SessionDraft): void
		deleteSession(profileId: string, sessionId: string): void
	}
}

export interface SimpleStorage {
	clear: typeof localStorage.clear
	getItem: typeof localStorage.getItem
	setItem: typeof localStorage.setItem
	removeItem: typeof localStorage.removeItem
}

export interface AppModelParams {
	storage: SimpleStorage
	onUpdate: (update: AppUpdate) => void
}
