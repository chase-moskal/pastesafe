
import * as loading from "metalshop/dist/metalfront/toolbox/loading.js"
import {mixinStyles} from "metalshop/dist/metalfront/framework/mixin-styles.js"

import {PsafeDashboardProps, ProfileDraft} from "../../types.js"
import {Component, html, property} from "../../app/component.js"

import {styles} from "./dashboard-styles.js"
import {renderButtonBar} from "./render-button-bar.js"
import {renderProfileList} from "./render-profile-list.js"

 @mixinStyles(styles)
export class PsafeDashboard extends Component {

	 @property({type: Object, reflect: false})
	props: PsafeDashboardProps

	 @property({type: Object, reflect: false})
	private _profileDraft: ProfileDraft = {label: ""}

	render() {
		if (!this.props) return null
		const {busy, profiles: unsortedProfiles, actions} = this.props
		const ready = loading.isReady(busy)
		const profiles = [...unsortedProfiles].sort(
			(a, b) => a.created > b.created ? -1 : 1
		)
		return html`

			${renderButtonBar({
				ready,
				profiles,
				profileDraft: this._profileDraft,
				onWipeProfiles: () => actions.clearProfiles(),
				onGenerateProfile: () => {
					actions.createProfile(this._profileDraft)
					this._profileDraft = {label: ""}
				},
				onUpdateProfileDraft: draft => this._profileDraft = draft,
			})}

			${renderProfileList({
				ready,
				profiles,
				onClickDeleteProfile: actions.deleteProfile,
				onClickDeleteSession: actions.deleteSession,
				onClickGenerateSession: actions.createSession,
			})}
		`
	}
}
