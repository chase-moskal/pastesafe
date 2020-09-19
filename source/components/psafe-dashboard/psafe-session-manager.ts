
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {SessionDraft, SessionManagerProps} from "../../types.js"
import {Component, html, property} from "../../app/component.js"

import keyIcon from "../../icons/key.js"
import {styles} from "./session-styles.js"
import {formatDate} from "../../toolbox/format-date.js"
import {renderLabelInput} from "./render-label-input.js"

 @mixinStyles(styles)
export class PsafeSessionManager extends Component {

	 @property({type: Object, reflect: false})
	props: SessionManagerProps

	 @property({type: Object, reflect: false})
	private _actual_sessionDraft: SessionDraft
	private get _sessionDraft() {
		const draft = this._actual_sessionDraft ?? {
			label: "",
			profileId: this.props?.profileId,
		}
		console.log("get", draft)
		return draft
	}
	private set _sessionDraft(draft: SessionDraft) {
		console.log("set", draft)
		this._actual_sessionDraft = draft
	}

	render() {
		const {ready, sessions, profileId, onClickGenerateSession} = this.props
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
							<div class=icon>
								${keyIcon}
							</div>
							<div class=details>
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
						</div>
					`)}
				</div>
			</div>
		`
	}
}
