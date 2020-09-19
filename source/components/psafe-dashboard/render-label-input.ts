
import {html} from "../../app/component.js"

export function renderLabelInput({
		label,
		ready,
		buttonText,
		placeholder,
		onButtonClick,
		onLabelUpdate,
	}: {
		label: string
		ready: boolean
		buttonText: string
		placeholder: string
		onButtonClick: () => void
		onLabelUpdate: (label: string) => void
	}) {

	const disabled = !ready

	function handleLabelChange({target}: {target: HTMLInputElement}) {
		onLabelUpdate(target.value)
	}

	return html`
		<div class=label_input>
			<input
				type=text
				placeholder=${placeholder}
				.value=${label}
				?disabled=${disabled}
				@change=${handleLabelChange}
				@keyup=${handleLabelChange}
				/>
			<button
				?disabled=${disabled}
				@click=${onButtonClick}>
					${buttonText}
			</button>
		</div>
	`
}
