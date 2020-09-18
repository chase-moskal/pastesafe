
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {ProfileDraft} from "../../types.js"
import {Component, html, property} from "../../app/component.js"

import {styles} from "./dashboard-styles.js"
import {renderButtonBar} from "./render-button-bar.js"
import {renderProfileList} from "./render-profile-list.js"

 @mixinStyles(styles)
export class PsafeDashboard extends Component {

	 @property({type: Object, reflect: false})
	private _profileDraft: ProfileDraft = {label: ""}

	render() {
		const {state, actions} = this.appUpdate
		const profiles = [...state.profiles].sort(
			(a, b) => a.created > b.created ? -1 : 1
		)
		return html`
			${renderButtonBar({
				profiles,
				profileDraft: this._profileDraft,
				onWipeProfiles: () => {
					actions.clearProfiles()
				},
				onGenerateProfile: () => {
					actions.createProfile(this._profileDraft)
					this._profileDraft = {label: ""}
				},
				onUpdateProfileDraft: draft => {
					this._profileDraft = draft
				},
			})}
			${renderProfileList({
				profiles
			})}
		`
	}
}
