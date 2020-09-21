
import {css} from "lit-element"
export const theme = css`

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

:host {
	display: block;
}

a {
	color: white;
}

svg {
	fill: currentColor;
}

/* coolinputs */

[data-coolinputs] {
	font-size: 0.9em;
}

[data-coolinputs] input[type=text],
[data-coolinputs] button {
	font: inherit;
	color: inherit;
	background: #082440;
	border: 1px solid #ffffff22;
	padding: 0.1rem;
}

[data-coolinputs] input[type=text]:hover,
[data-coolinputs] input[type=text]:focus {
	border-color: #ffffff44;
}

[data-coolinputs] button {
	border-radius: 0.2em;
	background: #2e6c76;
	cursor: pointer;
}

[data-coolinputs] button:hover,
[data-coolinputs] button:focus {
	background: #3a8490;
}

[data-coolinputs] [disabled] {
	opacity: 0.32;
	cursor: default;
	background: #00000044 !important;
}

/* iconbuttons */

[data-iconbuttons] button {
	font-size: 1em;
	cursor: pointer;
	border: none;
	color: inherit;
	background: transparent;
}

[data-iconbuttons] button:hover,
[data-iconbuttons] button:focus {
	transform: scale(1.2);
}

[data-iconbuttons] button[data-x]:hover,
[data-iconbuttons] button[data-x]:focus {
	color: red;
}

[data-iconbuttons] svg {
	display: block;
	width: 1em;
	height: 1em;
}

/* cooltextareas */


textarea[data-cooltextarea] {
	font: inherit;
	width: 100%;
	min-height: 8em;
	font-size: 1.2em;
	color: white;
	background: #0006;
	border: 1px solid #fff6;
}

`
