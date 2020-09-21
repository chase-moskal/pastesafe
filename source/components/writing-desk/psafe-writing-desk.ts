
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"
import {makeDebouncer} from "metalshop/dist/metalfront/toolbox/debouncer.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {PsafeWritingDeskProps} from "../../types.js"
import {encryptMessageLink, hintSize} from "../../app/links.js"
import {Component, html, property} from "../../app/component.js"

import styles from "./desk.css.js"

 @mixinStyles(styles)
export class PsafeWritingDesk extends Component {

	 @property({type: Object})
	props: PsafeWritingDeskProps

	 @property({type: String})
	message: string = ""

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
			const {message} = this
			const {invite} = this.props
			this.messageLink = await encryptMessageLink({
				invite,
				baseUrl: location.origin + location.pathname,
				message,
			})
		}
	})

	render() {
		if (!this.props) return null
		const {messageLink, messageLinkPreview} = this

		const handleTextChange = (event: InputEvent) => {
			const target = <HTMLTextAreaElement>event.target
			this.message = target.value
			this.debouncer.queue()
		}

		return html`
			<h2>writing desk - new style and layout coming soon</h2>
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
