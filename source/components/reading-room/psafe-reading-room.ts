
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {} from "../../types.js"
import {Component, html} from "../../app/component.js"

import styles from "./room.css.js"

 @mixinStyles(styles)
export class PsafeReadingRoom extends Component {

	render() {
		return html`
			<div>
				reading room
			</div>
		`
	}
}
