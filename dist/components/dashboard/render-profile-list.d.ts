import { Profile, SessionDraft } from "../../types.js";
export declare function renderProfileList({ ready, profiles, onClickDeleteSession, onClickDeleteProfile, onClickDownloadProfile, onClickGenerateSession, }: {
    ready: boolean;
    profiles: Profile[];
    onClickDeleteProfile: (profileId: string) => void;
    onClickDownloadProfile: (profile: Profile) => void;
    onClickGenerateSession: (draft: SessionDraft) => void;
    onClickDeleteSession: (profileId: string, sessionId: string) => void;
}): import("lit-html/lib/template-result").TemplateResult;
