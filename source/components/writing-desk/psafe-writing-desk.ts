
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"
import {makeDebouncer} from "metalshop/dist/metalfront/toolbox/debouncer.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {encrypt} from "../../toolbox/xcrypto.js"
import {PsafeWritingDeskProps} from "../../types.js"
import {encodeMessageLink, hintSize} from "../../app/links.js"
import {Component, html, property} from "../../app/component.js"

import styles from "./desk.css.js"

 @mixinStyles(styles)
export class PsafeWritingDesk extends Component {

	 @property({type: Object})
	props: PsafeWritingDeskProps

	 @property({type: String})
	text: string = ""

	 @property({type: String})
	messageLink: string = ""

	get messageLinkPreview() {
		const {messageLink} = this
		if (!messageLink) return null
		const {origin, pathname} = new URL(messageLink)
		const base = origin + pathname
		return messageLink.slice(0, base.length + 9 + hintSize) + "..."
	}

	private debouncer = makeDebouncer({
		delay: 500,
		action: async() => {
			const {text} = this
			const {sessionId, sessionPublicKey: publicKey} = this.props.invite
			const cipherText = await encrypt({text, publicKey})
			const link = encodeMessageLink({
				baseUrl: location.origin + location.pathname,
				payload: {
					sessionId,
					cipherText,
				}
			})
			this.messageLink = link
		}
	})

	render() {
		if (!this.props) return null
		const {messageLink, messageLinkPreview} = this

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
			${messageLink ? html`
				<div class=results>
					<p class=link>
						<a href=${messageLink}>
							${messageLinkPreview}
						</a>
					</p>
					<p class=stat>length ${messageLink.length}</p>
				</div>
			` : null}
		`
	}
}
