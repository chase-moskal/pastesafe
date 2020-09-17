import { ProfileDraft, SessionDraft, AppModelParams, Busy } from "../types.js";
export declare function makeAppModel({ storage, onUpdate }: AppModelParams): {
    actions: {
        setBusy(busy: Busy): void;
        createProfile(draft: ProfileDraft): Promise<void>;
        deleteProfile(profileId: string): Promise<void>;
        clearProfiles(): Promise<void>;
        createSession(draft: SessionDraft): Promise<void>;
        deleteSession(profileId: string, sessionId: string): Promise<void>;
    };
    refresh: () => void;
    hashChange: (link: string) => Promise<void>;
    start: () => void;
};
