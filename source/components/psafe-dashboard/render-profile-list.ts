
import {Profile, SessionDraft} from "../../types.js"
import {html} from "../../app/component.js"

import {formatDate} from "../../toolbox/format-date.js"
import {renderSessionManager} from "./render-session-manager.js"

export function renderProfileList({profiles, onGenerateSession}: {
		profiles: Profile[]
		onGenerateSession: (draft: SessionDraft) => void
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
					${renderSessionManager({
						onGenerateSession,
						profileId: profile.id,
						sessions: profile.sessions,
					})}
				</div>
			`)}
			${profiles.length > 0 ? null : html`
				<p class=empty-list-consolation>no profiles loaded</p>
			`}
		</div>
	`
}
