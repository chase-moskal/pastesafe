
import {WiredComponent, html} from "../app/component.js"
import {PsafeDashboardProps, PsafeWritingDeskProps, PsafeReadingRoomProps} from "../types.js"

export class PsafeApp extends WiredComponent {
	render() {

		// 'wired' components have access to app updates.
		// 'wired' components automatically rerender when state changes
		const {actions, state} = this.appUpdate

		// app routing and distribution of state and actions
		if (state.invite) return html`
			<psafe-writing-desk .props=${<PsafeWritingDeskProps>{
				invite: state.invite,
			}}></psafe-writing-desk>
		`
		else if (state.message) return html`
			<psafe-reading-room .props=${<PsafeReadingRoomProps>{
				message: state.message,
			}}></psafe-reading-room>
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
