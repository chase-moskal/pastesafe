import { html } from "../../app/component.js";
import { renderLabelInput } from "./render-label-input.js";
export function renderButtonBar({ ready, profiles, profileDraft, onWipeProfiles, onGenerateProfile, onUpdateProfileDraft, }) {
    const disabled = !ready;
    return html `
		<div class=buttonbar data-coolinputs>
			${renderLabelInput({
        ready,
        label: profileDraft.label,
        buttonText: "new profile",
        placeholder: "profile label",
        onButtonClick: onGenerateProfile,
        onLabelUpdate: label => onUpdateProfileDraft({ label }),
    })}
			${profiles.length < 1 ? null : html `
				<button
					class=destroybutton
					?disabled=${disabled}
					@click=${onWipeProfiles}>
						destroy all profiles
				</button>
			`}
		</div>
	`;
}
//# sourceMappingURL=render-button-bar.js.map