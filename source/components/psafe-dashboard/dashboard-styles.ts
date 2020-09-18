
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

.profile_label {
	color: white;
}

.empty-list-consolation {
	/* remove this rule to show a consolation message */
	display: none;
}

.buttonbar {
	display: flex;
	flex-direction: row;
}

.buttonbar > * + * {
	margin-left: 0.5em;
}

.buttonbar button.destroybutton {
	background: #3b3e10;
}

.buttonbar button.destroybutton:hover,
.buttonbar button.destroybutton:focus {
	background: maroon;
}

.sessionmanager {
	padding: 0.5em;
}

.session {
	margin-top: 0.5em;
	border-top: 1px solid #ffffff22;
	padding-top: 0.5em;
}

`
