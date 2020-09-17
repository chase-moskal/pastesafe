
import {Component, css, html} from "../app/component.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {ProfileDraft} from "../types.js"

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
	private _profileDraft: ProfileDraft = {label: ""}

	private _handleInputBlobChange({target}: {target: HTMLInputElement}) {
		this._profileDraft = {
			label: target.value
		}
	}

	private async _handleAddProfile() {
		await this.appUpdate.actions.createProfile(this._profileDraft)
	}

	private async _handleDestroyProfiles() {
		await this.appUpdate.actions.clearProfiles()
	}

	render() {
		const {share, appUpdate} = this
		return html`
			<h2>profile dashboard</h2>
			<div class=profilelist>
				${appUpdate.state.profiles.map(profile => html`
					<div class=profile>
						<h3>${profile.label}</h3>
						<p><strong>profile id</strong> ${profile.id}</p>
					</div>
				`)}
				${appUpdate.state.profiles.length > 0 ? null : html`
					<p class=none>no profiles loaded</p>
				`}
			</div>
			<div class=bar>
				<div class=inputblob>
					<input
						@change=${this._handleInputBlobChange}
						@keyup=${this._handleInputBlobChange}
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
