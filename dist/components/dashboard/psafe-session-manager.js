var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { mixinStyles } from "metalshop/dist/metalfront/framework/mixin-styles.js";
import { formatDate } from "../../toolbox/format-date.js";
import { encodeInviteLink } from "../../app/invite-links.js";
import { Component, html, property, repeat } from "../../app/component.js";
import keyIcon from "../../icons/key.svg.js";
import trashcanIcon from "../../icons/trashcan.svg.js";
import { styles } from "./session-styles.js";
import { renderLabelInput } from "./render-label-input.js";
let PsafeSessionManager = class PsafeSessionManager extends Component {
    get _sessionDraft() {
        var _a;
        const draft = this._actual_sessionDraft;
        if (!draft)
            this._actual_sessionDraft = {
                label: "",
                profileId: (_a = this.props) === null || _a === void 0 ? void 0 : _a.profileId,
            };
        return this._actual_sessionDraft;
    }
    set _sessionDraft(draft) {
        this._actual_sessionDraft = draft;
    }
    render() {
        const { ready, sessions, profileId, onClickGenerateSession, onClickDeleteSession } = this.props;
        const sortedSessions = [...sessions].sort((a, b) => a.created > b.created ? -1 : 1);
        function renderSession(session) {
            const baseUrl = location.origin + location.pathname;
            const inviteLink = encodeInviteLink({
                baseUrl,
                sessionId: session.id,
                sessionPublicKey: session.keys.publicKey,
            });
            const inviteLinkPreview = inviteLink.slice(0, baseUrl.length + 8) + "...";
            return html `
				<div class=session>
					<div class=session-icon>
						${keyIcon}
					</div>
					<div class=session-details>
						<h4>${session.label}</h4>
						<p>
							<strong>session id</strong>
							<span>${session.id}</span>
						</p>
						<p>
							<strong>created</strong>
							<span>${formatDate(session.created)}</span>
						</p>
						<p>
							<strong>link</strong>
							<span>
								<a target=_blank href=${inviteLink}>
									${inviteLinkPreview}
								</a>
							</span>
						</p>
					</div>
					<div class=session-buttons data-iconbuttons>
						<button
							data-x
							title="delete session"
							@click=${() => onClickDeleteSession(session.id)}>
								${trashcanIcon}
						</button>
					</div>
				</div>
			`;
        }
        return html `
			<div class=sessionmanager>
				<div class=sessioncontrols data-coolinputs>
					${renderLabelInput({
            ready,
            label: this._sessionDraft.label,
            placeholder: "session label",
            buttonText: "generate session",
            onButtonClick: () => {
                const { _sessionDraft: draft } = this;
                this._sessionDraft = { profileId, label: "" };
                onClickGenerateSession(draft);
            },
            onLabelUpdate: label => this._sessionDraft = {
                label,
                profileId: profileId,
            },
        })}
				</div>
				<div class=sessionlist>
					${repeat(sortedSessions, session => session.id, renderSession)}
				</div>
			</div>
		`;
    }
};
__decorate([
    property({ type: Object, reflect: false })
], PsafeSessionManager.prototype, "props", void 0);
__decorate([
    property({ type: Object, reflect: false })
], PsafeSessionManager.prototype, "_actual_sessionDraft", void 0);
PsafeSessionManager = __decorate([
    mixinStyles(styles)
], PsafeSessionManager);
export { PsafeSessionManager };
//# sourceMappingURL=psafe-session-manager.js.map