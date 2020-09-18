
import {html} from "../../app/component.js"
import {Session, SessionDraft} from "../../types.js"
import {formatDate} from "../../toolbox/format-date.js"

export function renderSessionManager({ready, profileId, sessions, onGenerateSession}: {
		ready: boolean
		profileId: string
		sessions: Session[]
		onGenerateSession: (draft: SessionDraft) => void
	}) {

	const disabled = !ready

	const sortedSessions = [...sessions].sort(
		(a, b) => a.created > b.created ? -1 : 1
	)

	function clickGenerate() {
		onGenerateSession({profileId, label: ""})
	}

	return html`
		<div class=sessionmanager>
			<div class=sessioncontrols data-coolinputs>
				<button ?disabled=${disabled} @click=${clickGenerate}>generate session</button>
			</div>
			<div class=sessionlist>
				${sortedSessions.map(session => html`
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
						<p>
							<strong>link</strong>
							<span><a href="#">https://pastesafe.org/#invite-${session.id.slice(0, 6)}...</a></span>
						</p>
					</div>
				`)}
			</div>
		</div>
	`
}
