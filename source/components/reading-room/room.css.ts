
import {css} from "../../app/component.js"
export default css`

:host > * + * {
	margin-top: 0.5em;
}

.secretbox textarea {
	padding: 0.5em 1em;
	min-height: 12em !important;
}

.profile {
	padding: 0 1em;
}

.session {
	display: flex;
	margin-top: 0.2em;
	padding-left: 1em;
}

.session[data-not-found] {
	color: red;
}

.session > * {
	flex: 0 0 auto;
}

.session .icon {
	margin-top: 0.25em;
	margin-right: 0.5em;
}

.icon svg {
	width: 2em;
	height: 2em;
}

.loading {
	position: relative;
	perspective: 30rem;
	transform-origin: center center;
}

.loading svg {
	width: 2em;
	height: 2em;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from{
		transform: rotate3d(0, 1, 0, 0deg);
	}
	to {
		transform: rotate3d(0, 1, 0, 360deg);
	}
}

`
