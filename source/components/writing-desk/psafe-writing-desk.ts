
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {} from "../../types.js"
import {Component, html, property} from "../../app/component.js"

import styles from "./desk.css.js"

 @mixinStyles(styles)
export class PsafeWritingDesk extends Component {

	render() {
		return html`
			<div>
				encryptor!
			</div>
		`
	}
}
