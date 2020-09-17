import { WiredComponent, html } from "../app/component.js";
export class PsafeApp extends WiredComponent {
    render() {
        // 'wired' components have access to app updates.
        // 'wired' components automatically rerender when state changes
        const { actions, state } = this.appUpdate;
        // app routing and distribution of state and actions
        if (state.invite)
            return html `
			<psafe-writing-desk .props=${{
                invite: state.invite,
            }}></psafe-writing-desk>
		`;
        else if (state.encrypted)
            return html `
			<psafe-reading-room .props=${{
                encrypted: state.encrypted,
                querySession: (sessionId) => {
                    const profile = state.profiles.find(p => p.sessions.find(s => s.id === sessionId));
                    if (profile) {
                        const session = profile.sessions.find(s => s.id === sessionId);
                        if (session) {
                            return { profile, session };
                        }
                    }
                },
            }}></psafe-reading-room>
		`;
        else
            return html `
			<psafe-dashboard .props=${{
                actions,
                busy: state.busy,
                profiles: state.profiles,
            }}></psafe-dashboard>
		`;
    }
}
//# sourceMappingURL=psafe-app.js.map