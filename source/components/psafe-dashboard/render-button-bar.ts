
import {html} from "../../app/component.js"
import {Profile, ProfileDraft} from "../../types.js"

export function renderButtonBar(params: {
		ready: boolean
		profiles: Profile[]
		profileDraft: ProfileDraft
		onWipeProfiles: () => void
		onGenerateProfile: () => void
		onUpdateProfileDraft: (draft: ProfileDraft) => void
	}) {

	function handleLabelChange({target}: {target: HTMLInputElement}) {
		params.onUpdateProfileDraft({label: target.value})
	}

	const disabled = !params.ready

	return html`
		<div class=buttonbar data-coolinputs>
			<div class=profile_generator>
				<input
					type=text
					placeholder="profile label"
					@change=${handleLabelChange}
					@keyup=${handleLabelChange}
					.value=${params.profileDraft.label}
					/>
				<button
					?disabled=${disabled}
					@click=${params.onGenerateProfile}>
						generate profile
				</button>
			</div>
			${params.profiles.length < 1 ? null : html`
				<button
					class=destroybutton
					?disabled=${disabled}
					@click=${params.onWipeProfiles}>
						destroy all profiles
				</button>
			`}
		</div>
	`
}
