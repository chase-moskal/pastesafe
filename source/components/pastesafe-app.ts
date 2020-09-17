
import {formatDate} from "metalshop/dist/metalfront/toolbox/dates.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {ProfileDraft} from "../types.js"
import {Component, css, html, property} from "../app/component.js"

const styles = css`

:host {
	background: lightskyblue;
}

:host > * + * {
	margin-top: 0.5em;
}

.profile {
	padding: 0.5em;
	background: #00000066;
	border: 1px solid #ffffff33;
	box-shadow: 3px 5px 6px #00000033;
}

.profile + .profile {
	margin-top: 0.5em;
}

`

 @mixinStyles(styles)
export class PastesafeApp extends Component {

	 @property({type: Object, reflect: false})
	private _profileDraft: ProfileDraft = {label: ""}

	private _handleInputBlobChange({target}: {target: HTMLInputElement}) {
		this._profileDraft = {
			label: target.value
		}
	}

	private async _handleAddProfile() {
		const {_profileDraft} = this
		this._profileDraft = {label: ""}
		await this.appUpdate.actions.createProfile(_profileDraft)
	}

	private async _handleDestroyProfiles() {
		await this.appUpdate.actions.clearProfiles()
	}

	render() {
		const {state} = this.appUpdate
		return html`
			<h2>profile dashboard</h2>
			<div class=profilelist>
				${state.profiles.map(profile => html`
					<div class=profile>
						<h3>${profile.label}</h3>
						<p><strong>profile id</strong> ${profile.id}</p>
						<p><strong>created</strong> ${(() => {
							const {datestring, timestring} = formatDate(profile.created)
							return `${datestring} ${timestring}`
						})()}</p>
					</div>
				`)}
				${state.profiles.length > 0 ? null : html`
					<p class=none>no profiles loaded</p>
				`}
			</div>
			<div class=bar>
				<div class=inputblob>
					<input
						@change=${this._handleInputBlobChange}
						@keyup=${this._handleInputBlobChange}
						.value=${this._profileDraft.label}
						type=text
						placeholder="profile name"
						/>
					<button @click=${this._handleAddProfile}>+ add profile</button>
				</div>
				<button @click=${this._handleDestroyProfiles}>destroy all profiles</button>
			</div>
		`
	}
}
