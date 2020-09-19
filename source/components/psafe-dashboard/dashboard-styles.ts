
import {css} from "../../app/component.js"
export const styles = css`

:host > * + * {
	margin-top: 0.5em;
}

:host {
	display: block;
}

.profilelist {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(30em, 1fr));
	justify-items: center;
	gap: 0.5em;
}

@media (max-width: 35em) {
	.profilelist {
		grid-template-columns: none;
	}
}

.profile {
	width: 100%;
	padding: 0.5em;
	background: #00000066;
	border: 1px solid #ffffff33;
	box-shadow: 3px 5px 6px #00000033;
}

.profile_card {
	display: flex;
	flex-direction: row;
}

.profile_endbuttons {
	font-size: 1.5em;
	margin-left: auto;
	margin-right: 0.25rem;
}

.profile_details h3 {
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
