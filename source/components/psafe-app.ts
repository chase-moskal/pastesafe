
import {WiredComponent, html, css, property} from "../app/component.js"
import {PsafeDashboardProps} from "../types.js"

export class PsafeApp extends WiredComponent {
	render() {
		const {actions, state} = this.appUpdate
		if (state.invite) return html`
			encryptor
			<psafe-encryptor></psafe-encryptor>
		`
		if (state.message) return html`
			decryptor
			<psafe-decryptor></psafe-decryptor>
		`
		else return html`
			<psafe-dashboard .props=${<PsafeDashboardProps>{
				actions,
				busy: state.busy,
				profiles: state.profiles,
			}}></psafe-dashboard>
		`
	}
}
