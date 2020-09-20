
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {PsafeWritingDeskProps} from "../../types.js"
import {Component, html, property} from "../../app/component.js"

import styles from "./desk.css.js"

 @mixinStyles(styles)
export class PsafeWritingDesk extends Component {

	 @property({type: Object, reflect: false})
	props: PsafeWritingDeskProps

	render() {
		if (!this.props) return null
		const {invite} = this.props
		return html`
			<div>
				writing desk
			</div>
		`
	}
}
