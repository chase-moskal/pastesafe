

import {LitElement, css, html} from "lit-element"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

const styles = css`

:host {
	background: lightskyblue;
}

`

 @mixinStyles(styles)
export class PastesafeApp extends LitElement {
	render() {
		return html`
			<h2>pastesafe dashboard</h2>
		`
	}
}
