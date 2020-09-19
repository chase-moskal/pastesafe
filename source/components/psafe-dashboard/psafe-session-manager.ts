
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {formatDate} from "../../toolbox/format-date.js"
import {Component, html, property} from "../../app/component.js"
import {encodeInviteLink} from "../../app/links.js"
import {Session, SessionDraft, SessionManagerProps} from "../../types.js"

import xIcon from "../../icons/x.svg.js"
import keyIcon from "../../icons/key.svg.js"

import {styles} from "./session-styles.js"
import {renderLabelInput} from "./render-label-input.js"
import { profile } from "console"

 @mixinStyles(styles)
export class PsafeSessionManager extends Component {

	 @property({type: Object, reflect: false})
	props: SessionManagerProps

	 @property({type: Object, reflect: false})
	private _actual_sessionDraft: SessionDraft
	private get _sessionDraft() {
		return this._actual_sessionDraft ?? {
			label: "",
			profileId: this.props?.profile.id,
		}
	}
	private set _sessionDraft(draft: SessionDraft) {
		this._actual_sessionDraft = draft
	}

	render() {
		const {ready, sessions, profile, onClickGenerateSession, onClickDeleteSession} = this.props
		const sortedSessions = [...sessions].sort(
			(a, b) => a.created > b.created ? -1 : 1
		)

		function renderSession(session: Session) {
			const baseUrl = location.origin + location.pathname
			const inviteLink = encodeInviteLink({
				baseUrl,
				payload: {
					profileId: profile.id,
					profileLabel: profile.label,
					profileCreated: profile.created,
					sessionId: session.id,
					sessionLabel: session.label,
					sessionCreated: session.created,
					sessionPublicKey: session.keys.publicKey,
				},
			})
			return html`
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
								<a href=${inviteLink}>
									${inviteLink.slice(0, baseUrl.length + 16)}
								</a>
							</span>
						</p>
					</div>
					<div class=session-buttons data-iconbuttons>
						<button
							data-x
							title="delete session"
							@click=${() => onClickDeleteSession(session.id)}>
								${xIcon}
						</button>
					</div>
				</div>
			`
		}

		return html`
			<div class=sessionmanager>
				<div class=sessioncontrols data-coolinputs>
					${renderLabelInput({
						ready,
						label: "",
						placeholder: "session label",
						buttonText: "generate session",
						onButtonClick: () => onClickGenerateSession(
							this._sessionDraft
						),
						onLabelUpdate: label => this._sessionDraft = {
							label,
							profileId: profile.id,
						},
					})}
				</div>
				<div class=sessionlist>
					${sortedSessions.map(renderSession)}
				</div>
			</div>
		`
	}
}
