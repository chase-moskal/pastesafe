
import {makeDebouncer} from "metalshop/dist/metalfront/toolbox/debouncer.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {PsafeWritingDeskProps} from "../../types.js"
import {Component, html, property} from "../../app/component.js"
import {encryptMessageData, encodeMessageLink} from "../../app/message-links.js"

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
		return messageLink.slice(0, base.length + 9 + 7) + "..."
	}

	private debouncer = makeDebouncer({
		delay: 500,
		action: async() => {
			const {message} = this
			const {invite} = this.props
			const encrypted = await encryptMessageData({
				message,
				invite,
			})
			this.messageLink = encodeMessageLink({
				baseUrl: location.origin + location.pathname,
				...encrypted,
			})
		}
	})

	 @property({type: Number})
	private previousCopy: number = 0

	get recentlyCopied() {
		const since = Date.now() - this.previousCopy
		return since < clipboardAnim
	}

	render() {
		if (!this.props) return null
		const {messageLink, messageLinkPreview, recentlyCopied} = this

		const handleTextChange = (event: InputEvent) => {
			const target = <HTMLTextAreaElement>event.target
			const {message: previousMessage} = this
			this.message = target.value
			if (this.message !== previousMessage) {
				this.messageLink = undefined
				this.debouncer.queue()
			}
		}

		const handleClickCopy = async() => {
			if (messageLink) {
				await navigator.clipboard.writeText(messageLink)
				this.previousCopy = Date.now()
				setTimeout(() => this.requestUpdate(), clipboardAnim + 1)
			}
		}

		return html`
			<div class=leadup>
				<h2>send your secret information</h2>
				<p>if you trust the invite, pastesafe is ready to encrypt your response below</p>
			</div>
			<div class=container>
				<div class=inputbox>
					<textarea
						data-cooltextarea
						placeholder="enter your secret response"
						@change=${handleTextChange}
						@keyup=${handleTextChange}
					></textarea>
				</div>
				<div class=resultbox>
					${messageLink ? html`
						<p class=link>
							${lockIcon}
							<a target=_blank href=${messageLink} title="encrypted message link">
								${messageLinkPreview}
							</a>
						</p>
						<div class=stats data-coolinputs>
							<p>your message is encrypted in this link. the other person already has a key to decrypt it.</p>
							${clipboardSupport ? html`
								<p>
									now just
									<button
										class=copybutton
										title="copy link to clipboard"
										?data-recently=${recentlyCopied}
										@click=${handleClickCopy}>
											${clippyIcon} ${recentlyCopied ? "copied" : "copy"}
									</button>
									the link and send it back
								</p>
							` : html`
								<p>now copy the link and send it back</p>
							`}
						</div>
					` : null}
				</div>
			</div>
		`
	}
}
