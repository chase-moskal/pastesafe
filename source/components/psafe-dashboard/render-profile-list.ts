
import xIcon from "../../icons/x.svg.js"
import {html} from "../../app/component.js"
import {formatDate} from "../../toolbox/format-date.js"
import {Profile, SessionDraft, SessionManagerProps} from "../../types.js"

export function renderProfileList({
		ready,
		profiles,
		onClickDeleteSession,
		onClickDeleteProfile,
		onClickGenerateSession,
	}: {
		ready: boolean
		profiles: Profile[]
		onClickDeleteProfile: (profileId: string) => void
		onClickGenerateSession: (draft: SessionDraft) => void
		onClickDeleteSession: (profileId: string, sessionId: string) => void
	}) {
	return html`
		<div class=profilelist>
			${profiles.map(profile => html`
				<div class=profile>
					<div class=profile_card>
						<div class=profile_details>
							<h3 class=profile_label>
								${profile.label}
							</h3>
							<p data-detail=id>
								<strong>profile id</strong>
								<span>${profile.id}</span>
							</p>
							<p data-detail=created title=${profile.created}>
								<strong>created</strong>
								<span>${formatDate(profile.created)}</span>
							</p>
						</div>
						<div class=profile_endbuttons data-iconbuttons>
							<button
								data-x
								title="delete profile"
								@click=${() => onClickDeleteProfile(profile.id)}>
									${xIcon}
							</button>
						</div>
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
