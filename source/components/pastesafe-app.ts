
import {Component, css, html} from "../app/component.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

const styles = css`

:host {
	background: lightskyblue;
}

`

 @mixinStyles(styles)
export class PastesafeApp extends Component {
	render() {
		const {share, appUpdate} = this
		console.log("render!", {share, appUpdate})
		return html`
			<h2>pastesafe dashboard</h2>
		`
	}
}
