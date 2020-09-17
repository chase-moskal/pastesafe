var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cloneDeep from "lodash-es/cloneDeep.js";
import { makeJsonStorage } from "metalshop/dist/toolbox/json-storage.js";
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js";
import { hashAny } from "../toolbox/hash.js";
import { randex } from "../toolbox/randex.js";
import { generateSessionKeys } from "../toolbox/xcrypto.js";
import { decodeInviteLink } from "./invite-links.js";
import { decodeMessageLink } from "./message-links.js";
export function makeAppModel({ storage, onUpdate }) {
    //
    // state and actions
    //
    let state = {
        profiles: [],
        invite: undefined,
        encrypted: undefined,
        busy: loading.ready(),
    };
    const actions = {
        setBusy(busy) {
            state.busy = busy;
        },
        createProfile(draft) {
            return __awaiter(this, void 0, void 0, function* () {
                const profile = {
                    id: randex(),
                    sessions: [],
                    label: draft.label,
                    created: Date.now(),
                };
                state.profiles.push(profile);
            });
        },
        deleteProfile(profileId) {
            return __awaiter(this, void 0, void 0, function* () {
                state.profiles = state.profiles.filter(p => p.id !== profileId);
            });
        },
        clearProfiles() {
            return __awaiter(this, void 0, void 0, function* () {
                state.profiles = [];
            });
        },
        createSession(draft) {
            return __awaiter(this, void 0, void 0, function* () {
                actions.setBusy(loading.loading());
                const session = {
                    id: randex(),
                    label: draft.label,
                    created: Date.now(),
                    keys: yield generateSessionKeys(),
                };
                const profile = state.profiles.find(p => p.id === draft.profileId);
                profile.sessions.push(session);
                actions.setBusy(loading.ready());
            });
        },
        deleteSession(profileId, sessionId) {
            return __awaiter(this, void 0, void 0, function* () {
                const profile = state.profiles.find(p => p.id === profileId);
                profile.sessions = profile.sessions.filter(s => s.id !== sessionId);
            });
        },
    };
    //
    // trigger an app update whenever state has changed
    //
    let previousStateHash;
    function triggerUpdate() {
        const stateHash = hashAny(state);
        const changed = stateHash !== previousStateHash;
        previousStateHash = stateHash;
        if (changed) {
            onUpdate({
                actions,
                state: Object.freeze(cloneDeep(state)),
            });
        }
    }
    //
    // save/load state from storage
    //
    const jsonStore = makeJsonStorage(storage);
    function save() {
        jsonStore.write("pastesafe_profiles", state.profiles);
    }
    function load() {
        state.profiles = jsonStore.read("pastesafe_profiles") || [];
    }
    function refresh() {
        load();
        triggerUpdate();
    }
    window.addEventListener("storage", (event) => {
        if (event.storageArea === window.localStorage) {
            refresh();
        }
    });
    for (const [key, action] of Object.entries(actions)) {
        actions[key] = (...args) => __awaiter(this, void 0, void 0, function* () {
            const results = yield action.apply(actions, args);
            save();
            triggerUpdate();
            return results;
        });
    }
    //
    // handle link change
    //
    function hashChange(link) {
        return __awaiter(this, void 0, void 0, function* () {
            state.invite = decodeInviteLink(link);
            state.encrypted = decodeMessageLink(link);
            triggerUpdate();
        });
    }
    return {
        actions,
        refresh,
        hashChange,
        start: refresh,
    };
}
//# sourceMappingURL=make-app-model.js.map