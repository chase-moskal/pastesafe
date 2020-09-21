
import {makeDebouncer} from "metalshop/dist/metalfront/toolbox/debouncer.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {PsafeWritingDeskProps} from "../../types.js"
import {encryptMessageLink, hintSize} from "../../app/links.js"
import {Component, html, property} from "../../app/component.js"

import lockIcon from "../../icons/lock.svg.js"
import clippyIcon from "../../icons/clippy.svg.js"

import styles from "./desk.css.js"

const clipboardAnim = 3000
const clipboardSupport = !!navigator.clipboard.writeText

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

	 @property({type: Number})
	private lastCopy: number = 0

	get recentlyCopied() {
		const since = Date.now() - this.lastCopy
		return since < clipboardAnim
	}

	render() {
		if (!this.props) return null
		const {messageLink, messageLinkPreview, recentlyCopied} = this

		const handleTextChange = (event: InputEvent) => {
			const target = <HTMLTextAreaElement>event.target
			this.message = target.value
			this.messageLink = undefined
			this.debouncer.queue()
		}

		const handleClickCopy = async() => {
			if (messageLink) {
				await navigator.clipboard.writeText(messageLink)
				this.lastCopy = Date.now()
				setTimeout(() => this.requestUpdate(), clipboardAnim + 1)
			}
		}

		return html`
			<div class=leadup>
				<h2>somebody asked you for secret information</h2>
				<p>pastesafe will encrypt your response</p>
			</div>
			<div class=container>
				<div class=inputbox>
					<textarea
						class=textinput
						placeholder="enter your secret response"
						@change=${handleTextChange}
						@keyup=${handleTextChange}
					></textarea>
				</div>
				<div class=resultbox>
					${messageLink ? html`
						<p class=link>
							${lockIcon}
							<a title="encrpyted message link" href=${messageLink}>
								${messageLinkPreview}
							</a>
						</p>
						<div class=stats data-coolinputs>
							<p>your message is encrypted in this big link</p>
							${clipboardSupport ? html`
								<p>now just <button class=copybutton title="copy link to clipboard" ?data-recently=${recentlyCopied} @click=${handleClickCopy}>${clippyIcon} ${recentlyCopied ? "copied" : "copy"}</button> and send back this link</p>
							` : html`
								<p>now copy this link and send it back</p>
							`}
							<p>whoever sent you the invite has the key to decrypt the link</p>
						</div>
					` : null}
				</div>
			</div>
		`
	}
}
