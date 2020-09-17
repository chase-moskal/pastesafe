import { html } from "../../app/component.js";
export function renderLabelInput({ label, ready, buttonText, placeholder, onButtonClick, onLabelUpdate, }) {
    const disabled = !ready;
    function handleLabelChange({ target }) {
        onLabelUpdate(target.value);
    }
    function handleInputKeyUp(event) {
        if (event.keyCode == 13) {
            handleLabelChange({ target: event.target });
            onButtonClick();
        }
    }
    return html `
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
	`;
}
//# sourceMappingURL=render-label-input.js.map