
import {css} from "../../app/component.js"
export const styles = css`

:host > * + * {
	margin-top: 0.5em;
}

:host {
	max-width: 640px;
	display: block;

}

.profile {
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
	margin-left: auto;
}

.buttonbar button.destroybutton:hover,
.buttonbar button.destroybutton:focus {
	background: maroon;
}

psafe-session-manager {
	padding: 0.5em;
}

`
