
import {Profile} from "../../types.js"

export function downloadProfile(profile: Profile) {
	const text = btoa(JSON.stringify(profile))
	const label = profile.label
		? (profile.label.replace(/\s/, "_") + "-")
		: ""
	const filename = `${label}${profile.id.slice(0, 7)}.pastesafe`

	const element = document.createElement("a")
	element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text))
	element.setAttribute("download", encodeURIComponent(filename))
	element.style.display = "none"

	document.body.appendChild(element)
	element.click()
	document.body.removeChild(element)
}
