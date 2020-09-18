
import {css} from "../../app/component.js"
export const styles = css`

:host {
	background: lightskyblue;
}

:host > * + * {
	margin-top: 0.5em;
}

.profile {
	max-width: 640px;
	padding: 0.5em;
	background: #00000066;
	border: 1px solid #ffffff33;
	box-shadow: 3px 5px 6px #00000033;
}

.profile + .profile {
	margin-top: 0.5em;
}

.none {
	display: none;
}

.bar {
	display: flex;
	flex-direction: row;
}

.bar > * + * {
	margin-left: 0.5em;
}

.bar button.destroybutton {
	background: #3b3e10;
}

.bar button.destroybutton:hover,
.bar button.destroybutton:focus {
	background: maroon;
}

`
