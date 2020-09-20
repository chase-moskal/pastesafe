
import {WiredComponent, html, css, property} from "../app/component.js"
import {PsafeDashboardProps} from "../types.js"

export class PsafeApp extends WiredComponent {
	render() {
		const {actions, state} = this.appUpdate
		if (state.invite) return html`
			<psafe-writing-desk></psafe-writing-desk>
		`
		if (state.message) return html`
			<psafe-reading-room></psafe-reading-room>
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
