
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {decryptMessageData} from "../../app/message-links.js"
import {Component, html, property} from "../../app/component.js"
import {PsafeReadingRoomProps, Profile, Session} from "../../types.js"

import keyIcon from "../../icons/key.svg.js"
import unlockIcon from "../../icons/unlock.svg.js"

import styles from "./room.css.js"

 @mixinStyles(styles)
export class PsafeReadingRoom extends Component {

	 @property({type: Object})
	props: PsafeReadingRoomProps

	firstUpdated() {
		if (this.props) this.decryption()
	}

	 @property({type: Object})
	private sesh: {profile: Profile, session: Session}

	 @property({type: String})
	private secret: string

	 @property({type: Array})
	private error: string

	async decryption() {
		this.sesh = undefined
		this.secret = undefined
		this.error = undefined
		const {encrypted, querySession} = this.props
		const sesh = querySession(encrypted.sessionId)
		this.sesh = sesh
		if (sesh) {
			try {
				const start = Date.now()
				this.secret = await decryptMessageData({
					encrypted,
					getPrivateKey: async () => sesh.session.keys.privateKey,
				})
				const time = Date.now() - start
				console.log(`decryption took ${(time / 1000).toFixed(2)}s`)
			}
			catch (error) {
				this.error = "decryption failure"
			}
		}
	}

	render() {
		const {props, secret, sesh, error} = this
		if (!props || !props.encrypted) return html`unknown error`
		const {sessionId} = props.encrypted

		const renderSecret = () => html`
			<div class=secretbox>
				${this.secret
					? html`<textarea class=secret data-cooltextarea readonly>${this.secret}</textarea>`
					: this.error
						? html`<p class=error>${this.error}</p>`
						: html`<p class=loading>${unlockIcon}</p>`}
			</div>
		`

		const renderSesh = ({profile, session}: {
				profile: Profile
				session: Session
			}) => html`

			<p class=note>decrypted using the following profile session</p>

			<div class=profile>
				${sesh.profile.label
					? html`<h3>${sesh.profile.label}</h3>`
					: null}
				<p><strong>profile id</strong> <span>${profile.id}</span></p>
				<p><strong>profile created</strong> <span>${profile.created}</span></p>
				<div class=session>
					<div class=icon>
						${keyIcon}
					</div>
					<div class=stats>
						${sesh.session.label
							? html`<h3>${sesh.session.label}</h3>`
							: null}
						<p><strong>session id</strong> <span>${session.id}</span></p>
						<p><strong>session created</strong> <span>${session.created}</span></p>
					</div>
				</div>
			</div>
		`

		return html`
			<h2>secret message</h2>
			${renderSecret()}
			${sesh
				? renderSesh(sesh)
				: html`
					<div class=session data-not-found>
					<p>cannot find session ${sessionId}</p>
					</div>
				`}
		`
	}
}
