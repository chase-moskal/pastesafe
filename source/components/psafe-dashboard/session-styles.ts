
import {css} from "../../app/component.js"
export const styles = css`

h4 {
	color: white;
}

svg {
	fill: currentColor;
}

.session {
	display: flex;
	flex-direction: row;

	margin-top: 0.5em;
	border-top: 1px solid #ffffff22;
	padding-top: 0.5em;
}

.session .icon {
	margin-top: 0.25em;
	margin-right: 0.5em;
}

.session .icon svg {
	width: 1.5em;
	height: 1.5em;
}

.session .details {
	flex: 1 0 auto
}

.session-buttons button {
	cursor: pointer;
	border: none;
	color: inherit;
	background: transparent;
}

.session-buttons button:hover,
.session-buttons button:focus {
	transform: scale(1.2);
	color: red;
}

.session-buttons svg {
	display: block;
	width: 1.5em;
	height: 1.5em;
}

`
