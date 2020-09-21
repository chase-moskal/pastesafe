
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"
import {makeDebouncer} from "metalshop/dist/metalfront/toolbox/debouncer.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {PsafeWritingDeskProps} from "../../types.js"
import {Component, html, property} from "../../app/component.js"

import styles from "./desk.css.js"

import {encrypt} from "../../toolbox/xcrypto.js"

 @mixinStyles(styles)
export class PsafeWritingDesk extends Component {

	 @property({type: Object})
	props: PsafeWritingDeskProps

	 @property({type: String})
	text: string = ""

	 @property({type: String})
	result: string = ""

	private debouncer = makeDebouncer({
		delay: 500,
		action: async() => {
			const {text} = this
			const {sessionId, sessionPublicKey: publicKey} = this.props.invite
			const cipherText = await encrypt({text, publicKey})
			this.result = cipherText
		}
	})

	render() {
		if (!this.props) return null
		const {invite} = this.props

		const handleTextChange = (event: InputEvent) => {
			const target = <HTMLTextAreaElement>event.target
			this.text = target.value
			this.debouncer.queue()
		}

		return html`
			<textarea
				@change=${handleTextChange}
				@keyup=${handleTextChange}
			></textarea>
			<p class=result><a>${this.result}</a></p>
		`
	}
}
