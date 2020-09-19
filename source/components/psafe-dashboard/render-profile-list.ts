
import {html} from "../../app/component.js"
import {Profile, SessionDraft} from "../../types.js"
import {formatDate} from "../../toolbox/format-date.js"

export function renderProfileList({ready, profiles, onClickGenerateSession}: {
		ready: boolean
		profiles: Profile[]
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
						.props=${{
							ready,
							profileId: profile.id,
							sessions: profile.sessions,
							onClickGenerateSession,
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
