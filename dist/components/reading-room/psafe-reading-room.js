var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mixinStyles } from "metalshop/dist/metalfront/framework/mixin-styles.js";
import { formatDate } from "../../toolbox/format-date.js";
import { decryptMessageData } from "../../app/message-links.js";
import { Component, html, property } from "../../app/component.js";
import keyIcon from "../../icons/key.svg.js";
import unlockIcon from "../../icons/unlock.svg.js";
import styles from "./room.css.js";
let PsafeReadingRoom = class PsafeReadingRoom extends Component {
    firstUpdated() {
        if (this.props)
            this.decryption();
    }
    decryption() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sesh = undefined;
            this.secret = undefined;
            this.error = undefined;
            const { encrypted, querySession } = this.props;
            const sesh = querySession(encrypted.sessionId);
            this.sesh = sesh;
            if (sesh) {
                try {
                    const start = Date.now();
                    this.secret = yield decryptMessageData({
                        encrypted,
                        getPrivateKey: () => __awaiter(this, void 0, void 0, function* () { return sesh.session.keys.privateKey; }),
                    });
                    const time = Date.now() - start;
                    console.log(`decryption took ${(time / 1000).toFixed(2)}s`);
                }
                catch (error) {
                    this.error = "decryption failure";
                }
            }
        });
    }
    render() {
        const { props, secret, sesh, error } = this;
        if (!props || !props.encrypted)
            return html `unknown error`;
        const { sessionId } = props.encrypted;
        const renderSecret = () => html `
			<div class=secretbox>
				${this.secret
            ? html `<textarea class=secret data-cooltextarea readonly>${this.secret}</textarea>`
            : this.error
                ? html `<p class=error>${this.error}</p>`
                : html `<p class=loading>${unlockIcon}</p>`}
			</div>
		`;
        const renderSesh = ({ profile, session }) => html `

			<p class=note>decrypted using the following profile session</p>

			<div class=profile>
				${sesh.profile.label
            ? html `<h3>${sesh.profile.label}</h3>`
            : null}
				<p><strong>profile id</strong> <span>${profile.id}</span></p>
				<p><strong>profile created</strong> <span>${formatDate(profile.created)}</span></p>
				<div class=session>
					<div class=icon>
						${keyIcon}
					</div>
					<div class=stats>
						${sesh.session.label
            ? html `<h3>${sesh.session.label}</h3>`
            : null}
						<p><strong>session id</strong> <span>${session.id}</span></p>
						<p><strong>session created</strong> <span>${formatDate(session.created)}</span></p>
					</div>
				</div>
			</div>
		`;
        return html `
			<h2>secret message</h2>
			${renderSecret()}
			${sesh
            ? renderSesh(sesh)
            : html `
					<div class=session data-not-found>
					<p>cannot find session ${sessionId}</p>
					</div>
				`}
		`;
    }
};
__decorate([
    property({ type: Object })
], PsafeReadingRoom.prototype, "props", void 0);
__decorate([
    property({ type: Object })
], PsafeReadingRoom.prototype, "sesh", void 0);
__decorate([
    property({ type: String })
], PsafeReadingRoom.prototype, "secret", void 0);
__decorate([
    property({ type: Array })
], PsafeReadingRoom.prototype, "error", void 0);
PsafeReadingRoom = __decorate([
    mixinStyles(styles)
], PsafeReadingRoom);
export { PsafeReadingRoom };
//# sourceMappingURL=psafe-reading-room.js.map