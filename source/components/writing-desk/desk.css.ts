
import {css} from "../../app/component.js"
export default css`

.container {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	margin: 1em auto;
}

.container > * {
	flex: 1 0 auto;
}

.textinput, .resultbox {
	min-width: 30em;
	padding: 0.5em 1em;
}

.textinput {
	font: inherit;
	width: 100%;
	min-height: 8em;
	font-size: 1.2em;
	color: white;
	background: #0006;
	border: 1px solid #fff6;
}

.resultbox {
	flex: 0 0 auto;
}

.link {
	color: white;
	font-size: 1.5em;
	text-shadow: 0 0 4px #fffb;
}

.link * {
	display: inline-block;
	vertical-align: middle;
}

.stats {
	margin-top: 0.5em;
	padding-left: 2.5em;
}

.stats > * + * {
	margin-top: 0.5em;
}

.stats button.copybutton {
	display: inline-block;
	padding: 0.1em 0.5em;
	min-width: 5em;
}

.copybutton > * {
	display: inline-block;
	vertical-align: middle;
}

.copybutton svg {
	width: 1em;
	height: 1em;
}

.copybutton[data-recently] {
	position: relative;
	opacity: 0.3;
}

@media (max-width: 700px) {
	.textinput, .resultbox {
		min-width: unset;
	}
}

`
