
import {html} from "../../app/component.js"
import {formatDate} from "../../toolbox/format-date.js"
import {Profile, SessionDraft, SessionManagerProps} from "../../types.js"

export function renderProfileList({
		ready,
		profiles,
		onClickDeleteSession,
		onClickGenerateSession,
	}: {
		ready: boolean
		profiles: Profile[]
		onClickDeleteSession: (profileId: string, sessionId: string) => void
		onClickGenerateSession: (draft: SessionDraft) => void
	}) {
	return html`
		<div class=profilelist>
			${profiles.map(profile => html`
				<div class=profile>
					<h3 class=profile_label>
						${profile.label}
					</h3>
					<div class=profile_details>
						<p data-detail=id>
							<strong>profile id</strong>
							<span>${profile.id}</span>
						</p>
						<p data-detail=created title=${profile.created}>
							<strong>created</strong>
							<span>${formatDate(profile.created)}</span>
						</p>
					</div>
					<psafe-session-manager
						.props=${<SessionManagerProps>{
							ready,
							profileId: profile.id,
							sessions: profile.sessions,
							onClickGenerateSession,
							onClickDeleteSession: sessionId => onClickDeleteSession(profile.id, sessionId),
						}}
					></psafe-session-manager>
				</div>
			`)}
			${profiles.length > 0 ? null : html`
				<p class=empty-list-consolation>no profiles loaded</p>
			`}
		</div>
	`
}
