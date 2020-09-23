
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {formatDate} from "../../toolbox/format-date.js"
import {encodeInviteLink, hintSize} from "../../app/invite-links.js"
import {Component, html, property, repeat} from "../../app/component.js"
import {Session, SessionDraft, SessionManagerProps} from "../../types.js"

import keyIcon from "../../icons/key.svg.js"
import trashcanIcon from "../../icons/trashcan.svg.js"

import {styles} from "./session-styles.js"
import {renderLabelInput} from "./render-label-input.js"

 @mixinStyles(styles)
export class PsafeSessionManager extends Component {

	 @property({type: Object, reflect: false})
	props: SessionManagerProps

	 @property({type: Object, reflect: false})
	private _actual_sessionDraft: SessionDraft
	private get _sessionDraft() {
		const draft = this._actual_sessionDraft
		if (!draft) this._actual_sessionDraft = {
			label: "",
			profileId: this.props?.profileId,
		}
		return this._actual_sessionDraft
	}
	private set _sessionDraft(draft: SessionDraft) {
		this._actual_sessionDraft = draft
	}

	render() {
		const {ready, sessions, profileId, onClickGenerateSession, onClickDeleteSession} = this.props
		const sortedSessions = [...sessions].sort(
			(a, b) => a.created > b.created ? -1 : 1
		)

		function renderSession(session: Session) {
			const baseUrl = location.origin + location.pathname
			const inviteLink = encodeInviteLink({
				baseUrl,
				payload: {
					sessionId: session.id,
					sessionPublicKey: session.keys.publicKey,
				},
			})
			const inviteLinkPreview = inviteLink.slice(0, baseUrl.length + 8 + hintSize) + "..."
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
			`
		}

		return html`
			<div class=sessionmanager>
				<div class=sessioncontrols data-coolinputs>
					${renderLabelInput({
						ready,
						label: this._sessionDraft.label,
						placeholder: "session label",
						buttonText: "generate session",
						onButtonClick: () => {
							const {_sessionDraft: draft} = this
							this._sessionDraft = {profileId, label: ""}
							onClickGenerateSession(draft)
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
		`
	}
}
