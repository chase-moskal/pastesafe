
import {formatDate} from "metalshop/dist/metalfront/toolbox/dates.js"

import {Profile} from "../../types.js"
import {html} from "../../app/component.js"

export function renderProfileList({profiles}: {
		profiles: Profile[]
	}) {
	return html`
		<div class=profilelist>
			${profiles.map(profile => html`
				<div class=profile>
					<h3>${profile.label}</h3>
					<p><strong>profile id</strong> ${profile.id}</p>
					<p title=${profile.created}><strong>created</strong> ${(() => {
						const {datestring, timestring} = formatDate(profile.created)
						return `${datestring} ${timestring}`
					})()}</p>
				</div>
			`)}
			${profiles.length > 0 ? null : html`
				<p class=empty-list-consolation>no profiles loaded</p>
			`}
		</div>
	`
}
