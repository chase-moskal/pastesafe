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
var _a;
import { makeDebouncer } from "metalshop/dist/metalfront/toolbox/debouncer.js";
import { mixinStyles } from "metalshop/dist/metalfront/framework/mixin-styles.js";
import { Component, html, property } from "../../app/component.js";
import { encryptMessageData, encodeMessageLink } from "../../app/message-links.js";
import lockIcon from "../../icons/lock.svg.js";
import clippyIcon from "../../icons/clippy.svg.js";
import styles from "./desk.css.js";
const clipboardAnim = 3000;
const clipboardSupport = !!((_a = navigator.clipboard) === null || _a === void 0 ? void 0 : _a.writeText);
let PsafeWritingDesk = class PsafeWritingDesk extends Component {
    constructor() {
        super(...arguments);
        this.message = "";
        this.messageLink = "";
        this.debouncer = makeDebouncer({
            delay: 500,
            action: () => __awaiter(this, void 0, void 0, function* () {
                const { message } = this;
                const { invite } = this.props;
                const encrypted = yield encryptMessageData({
                    message,
                    invite,
                });
                this.messageLink = encodeMessageLink(Object.assign({ baseUrl: location.origin + location.pathname }, encrypted));
            })
        });
        this.previousCopy = 0;
    }
    get messageLinkPreview() {
        const { messageLink } = this;
        if (!messageLink)
            return null;
        const { origin, pathname } = new URL(messageLink);
        const base = origin + pathname;
        return messageLink.slice(0, base.length + 9 + 7) + "...";
    }
    get recentlyCopied() {
        const since = Date.now() - this.previousCopy;
        return since < clipboardAnim;
    }
    render() {
        if (!this.props)
            return null;
        const { messageLink, messageLinkPreview, recentlyCopied } = this;
        const handleTextChange = (event) => {
            const target = event.target;
            const { message: previousMessage } = this;
            this.message = target.value;
            if (this.message !== previousMessage) {
                this.messageLink = undefined;
                this.debouncer.queue();
            }
        };
        const handleClickCopy = () => __awaiter(this, void 0, void 0, function* () {
            if (messageLink) {
                yield navigator.clipboard.writeText(messageLink);
                this.previousCopy = Date.now();
                setTimeout(() => this.requestUpdate(), clipboardAnim + 1);
            }
        });
        return html `
			<div class=leadup>
				<h2>send your secret information</h2>
				<p>if you trust the invite, pastesafe is ready to encrypt your response below</p>
			</div>
			<div class=container>
				<div class=inputbox>
					<textarea
						data-cooltextarea
						placeholder="enter your secret response"
						@change=${handleTextChange}
						@keyup=${handleTextChange}
					></textarea>
				</div>
				<div class=resultbox>
					${messageLink ? html `
						<p class=link>
							${lockIcon}
							<a target=_blank href=${messageLink} title="encrypted message link">
								${messageLinkPreview}
							</a>
						</p>
						<div class=stats data-coolinputs>
							<p>your message is encrypted in this link. the other person already has a key to decrypt it.</p>
							${clipboardSupport ? html `
								<p>
									now just
									<button
										class=copybutton
										title="copy link to clipboard"
										?data-recently=${recentlyCopied}
										@click=${handleClickCopy}>
											${clippyIcon} ${recentlyCopied ? "copied" : "copy"}
									</button>
									the link and send it back
								</p>
							` : html `
								<p>now copy the link and send it back</p>
							`}
						</div>
					` : null}
				</div>
			</div>
		`;
    }
};
__decorate([
    property({ type: Object })
], PsafeWritingDesk.prototype, "props", void 0);
__decorate([
    property({ type: String })
], PsafeWritingDesk.prototype, "message", void 0);
__decorate([
    property({ type: String })
], PsafeWritingDesk.prototype, "messageLink", void 0);
__decorate([
    property({ type: Number })
], PsafeWritingDesk.prototype, "previousCopy", void 0);
PsafeWritingDesk = __decorate([
    mixinStyles(styles)
], PsafeWritingDesk);
export { PsafeWritingDesk };
//# sourceMappingURL=psafe-writing-desk.js.map