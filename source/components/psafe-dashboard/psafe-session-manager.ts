
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {formatDate} from "../../toolbox/format-date.js"
import {SessionDraft, SessionManagerProps} from "../../types.js"
import {Component, html, property} from "../../app/component.js"

import xIcon from "../../icons/x.svg.js"
import keyIcon from "../../icons/key.svg.js"

import {styles} from "./session-styles.js"
import {renderLabelInput} from "./render-label-input.js"

 @mixinStyles(styles)
export class PsafeSessionManager extends Component {

	 @property({type: Object, reflect: false})
	props: SessionManagerProps

	 @property({type: Object, reflect: false})
	private _actual_sessionDraft: SessionDraft
	private get _sessionDraft() {
		return this._actual_sessionDraft ?? {
			label: "",
			profileId: this.props?.profileId,
		}
	}
	private set _sessionDraft(draft: SessionDraft) {
		this._actual_sessionDraft = draft
	}

	render() {
		const {ready, sessions, profileId, onClickGenerateSession, onClickDeleteSession} = this.props
		const sortedSessions = [...sessions].sort(
			(a, b) => a.created > b.created ? -1 : 1
		)
		return html`
			<div class=sessionmanager>
				<div class=sessioncontrols data-coolinputs>
					${renderLabelInput({
						ready,
						label: "",
						placeholder: "session label",
						buttonText: "generate session",
						onButtonClick: () => onClickGenerateSession(this._sessionDraft),
						onLabelUpdate: label => this._sessionDraft = {label, profileId},
					})}
				</div>
				<div class=sessionlist>
					${sortedSessions.map(session => html`
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
									<span><a href="#">
										https://pastesafe.org/#invite-${session.id.slice(0, 6)}...
									</a></span>
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
					`)}
				</div>
			</div>
		`
	}
}
