import { Profile, ProfileDraft } from "../../types.js";
export declare function renderButtonBar({ ready, profiles, profileDraft, onWipeProfiles, onGenerateProfile, onUpdateProfileDraft, }: {
    ready: boolean;
    profiles: Profile[];
    profileDraft: ProfileDraft;
    onWipeProfiles: () => void;
    onGenerateProfile: () => void;
    onUpdateProfileDraft: (draft: ProfileDraft) => void;
}): import("lit-html/lib/template-result").TemplateResult;
