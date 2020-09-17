import { html, repeat } from "../../app/component.js";
import trashcanIcon from "../../icons/trashcan.svg.js";
import { formatDate } from "../../toolbox/format-date.js";
import downloadIcon from "../../icons/desktop-download.svg.js";
export function renderProfileList({ ready, profiles, onClickDeleteSession, onClickDeleteProfile, onClickDownloadProfile, onClickGenerateSession, }) {
    return html `
		<div class=profilelist>
			${repeat(profiles, profile => profile.id, profile => html `
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
							<div class=profile_actions data-iconbuttons>
								<button
									class=profile_download
									@click=${() => onClickDownloadProfile(profile)}>
										${downloadIcon}
								</button>
								<span>download</span>
							</div>
						</div>
						<div class=profile_endbuttons data-iconbuttons>
							<button
								data-x
								title="delete profile"
								@click=${() => onClickDeleteProfile(profile.id)}>
									${trashcanIcon}
							</button>
						</div>
					</div>
					<psafe-session-manager
						.props=${{
        ready,
        profileId: profile.id,
        sessions: profile.sessions,
        onClickGenerateSession,
        onClickDeleteSession: sessionId => onClickDeleteSession(profile.id, sessionId),
    }}
					></psafe-session-manager>
				</div>
			`)}
			${profiles.length > 0 ? null : html `
				<p class=empty-list-consolation>no profiles loaded</p>
			`}
		</div>
	`;
}
//# sourceMappingURL=render-profile-list.js.map