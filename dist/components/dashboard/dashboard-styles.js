import { css } from "../../app/component.js";
export const styles = css `

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

.profile_actions {
	margin: 0.5em auto;
	margin-left: 1em;
}

.profile_download {
	font-weight: bold;
	border: none;
	color: inherit;
	background: transparent;
}

.profile_download:hover,
.profile_download:focus {
	color: white;
	transform: scale(1.1);
}

.profile_download > * {
	display: inline-block;
	vertical-align: middle;
}

.profile_download svg {
	width: 1.2em;
	height: 1.2em;
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
	background: #3d3321;
	margin-left: auto;
}

.buttonbar button.destroybutton:hover,
.buttonbar button.destroybutton:focus {
	background: maroon;
}

psafe-session-manager {
	padding: 0.5em;
}

`;
//# sourceMappingURL=dashboard-styles.js.map