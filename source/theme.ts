import { boundAttributeSuffix } from "lit-html/lib/template"

import {css} from "lit-element"

export const theme = css`

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

[data-coolinputs] input[type=text],
[data-coolinputs] button {
	font: inherit;
	color: inherit;
	background: #082440;
	border: 1px solid #ffffff22;
	padding: 0.2rem;
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

`
