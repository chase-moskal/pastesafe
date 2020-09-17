import { Subscribe } from "metalshop/dist/toolbox/pubsub.js";
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js";
import { makeAppModel } from "./app/make-app-model.js";
export declare type AppModel = ReturnType<typeof makeAppModel>;
export declare type AppActions = AppModel["actions"];
export declare type Busy = loading.Load<void>;
export interface AppState {
    busy: Busy;
    profiles: Profile[];
    invite: InvitePayload;
    encrypted: EncryptedMessage;
}
export interface AppUpdateListener {
    (update: AppUpdate): void;
}
export interface AppShare {
    onUpdate: Subscribe<AppUpdateListener>;
}
export interface ProfileDraft {
    label: string;
}
export interface Profile {
    id: string;
    label: string;
    created: number;
    sessions: Session[];
}
export interface SessionDraft {
    profileId: string;
    label: string;
}
export interface Keys {
    publicKey: JsonWebKey;
    privateKey: JsonWebKey;
}
export interface Session {
    id: string;
    keys: Keys;
    label: string;
    created: number;
}
export interface AppUpdate {
    state: AppState;
    actions: AppActions;
}
export interface MinimalStorage {
    clear: typeof localStorage.clear;
    getItem: typeof localStorage.getItem;
    setItem: typeof localStorage.setItem;
    removeItem: typeof localStorage.removeItem;
}
export interface AppModelParams {
    storage: MinimalStorage;
    onUpdate: (update: AppUpdate) => void;
}
export interface PsafeDashboardProps {
    busy: Busy;
    profiles: Profile[];
    actions: AppActions;
}
export interface PsafeWritingDeskProps {
    invite: InvitePayload;
}
export interface PsafeReadingRoomProps {
    encrypted: EncryptedMessage;
    querySession: (sessionId: string) => {
        profile: Profile;
        session: Session;
    };
}
export interface SessionManagerProps {
    ready: boolean;
    profileId: string;
    sessions: Session[];
    onClickGenerateSession: (draft: SessionDraft) => void;
    onClickDeleteSession: (sessionId: string) => void;
}
export interface InvitePayload {
    sessionId: string;
    sessionPublicKey: JsonWebKey;
}
export interface EncryptedMessage {
    sessionId: string;
    aesCipherbinary: ArrayBuffer;
    messageCipherbinary: ArrayBuffer;
}
export interface InviteLink extends InvitePayload {
    baseUrl: string;
}
export interface MessageLink extends EncryptedMessage {
    baseUrl: string;
}
