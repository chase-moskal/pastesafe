var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js";
import { mixinStyles } from "metalshop/dist/metalfront/framework/mixin-styles.js";
import { Component, html, property } from "../../app/component.js";
import { styles } from "./dashboard-styles.js";
import { downloadProfile } from "./download-profile.js";
import { renderButtonBar } from "./render-button-bar.js";
import { renderProfileList } from "./render-profile-list.js";
let PsafeDashboard = class PsafeDashboard extends Component {
    constructor() {
        super(...arguments);
        this._profileDraft = { label: "" };
    }
    render() {
        if (!this.props)
            return null;
        const { busy, profiles: unsortedProfiles, actions } = this.props;
        const ready = loading.isReady(busy);
        const profiles = [...unsortedProfiles].sort((a, b) => a.created > b.created ? -1 : 1);
        return html `

			${renderButtonBar({
            ready,
            profiles,
            profileDraft: this._profileDraft,
            onWipeProfiles: () => actions.clearProfiles(),
            onGenerateProfile: () => {
                actions.createProfile(this._profileDraft);
                this._profileDraft = { label: "" };
            },
            onUpdateProfileDraft: draft => this._profileDraft = draft,
        })}

			${renderProfileList({
            ready,
            profiles,
            onClickDeleteProfile: actions.deleteProfile,
            onClickDeleteSession: actions.deleteSession,
            onClickGenerateSession: actions.createSession,
            onClickDownloadProfile: downloadProfile,
        })}
		`;
    }
};
__decorate([
    property({ type: Object, reflect: false })
], PsafeDashboard.prototype, "props", void 0);
__decorate([
    property({ type: Object, reflect: false })
], PsafeDashboard.prototype, "_profileDraft", void 0);
PsafeDashboard = __decorate([
    mixinStyles(styles)
], PsafeDashboard);
export { PsafeDashboard };
//# sourceMappingURL=psafe-dashboard.js.map