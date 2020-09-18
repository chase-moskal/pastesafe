
import {html} from "../../app/component.js"
import {Profile, ProfileDraft} from "../../types.js"

export function renderButtonBar(x: {
		profiles: Profile[]
		profileDraft: ProfileDraft
		onWipeProfiles: () => void
		onGenerateProfile: () => void
		onUpdateProfileDraft: (draft: ProfileDraft) => void
	}) {

	function handleLabelChange({target}: {target: HTMLInputElement}) {
		x.onUpdateProfileDraft({label: target.value})
	}

	return html`
		<div class=buttonbar data-coolinputs>
			<div class=inputblob>
				<input
					type=text
					placeholder="profile name"
					@change=${handleLabelChange}
					@keyup=${handleLabelChange}
					.value=${x.profileDraft.label}
					/>
				<button @click=${x.onGenerateProfile}>generate profile</button>
			</div>
			${x.profiles.length < 1 ? null : html`
				<button class=destroybutton @click=${x.onWipeProfiles}>destroy all profiles</button>
			`}
		</div>
	`
}
