
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {Component, html} from "../../app/component.js"

import styles from "./room.css.js"

 @mixinStyles(styles)
export class PsafeReadingRoom extends Component {

	render() {
		return html`
			<h2>reading room - coming soon</h2>
		`
	}
}
