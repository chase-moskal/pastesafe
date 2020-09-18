
import {html} from "../../app/component.js"
import {Session, SessionDraft} from "../../types.js"
import {formatDate} from "../../toolbox/format-date.js"

export function renderSessionManager({profileId, sessions, onGenerateSession}: {
		profileId: string,
		sessions: Session[]
		onGenerateSession: (draft: SessionDraft) => void
	}) {

	function clickGenerate() {
		onGenerateSession({profileId, label: ""})
	}

	return html`
		<div class=sessionmanager>
			<div class="sessioncontrols">
				<button @click=${clickGenerate}>generate session</button>
			</div>
			<div class=sessionlist>
				${sessions.map(session => html`
					<div class=session>
						<h4>${session.label}</h4>
						<p>
							<strong>session id</strong>
							<span>${session.id}</span>
						</p>
						<p>
							<strong>created</strong>
							<span>${formatDate(session.created)}</span>
						</p>
					</div>
				`)}
			</div>
		</div>
	`
}
