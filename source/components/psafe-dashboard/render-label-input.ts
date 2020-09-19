
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

	function handleInputKeyUp(event: KeyboardEvent) {
		if (event.keyCode == 13) {
			handleLabelChange({target: <HTMLInputElement>event.target})
			onButtonClick()
		}
	}

	return html`
		<div class=label_input>
			<button
				?disabled=${disabled}
				@click=${onButtonClick}>
					${buttonText}
			</button>
			<input
				type=text
				placeholder=${placeholder}
				.value=${label}
				?disabled=${disabled}
				@change=${handleLabelChange}
				@keyup=${handleInputKeyUp}
				/>
		</div>
	`
}
