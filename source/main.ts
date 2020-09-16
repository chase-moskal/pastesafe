
import {themeComponents} from "metalshop/dist/metalfront/framework/theme-components.js"
import {registerComponents} from "metalshop/dist/metalfront/toolbox/register-components.js"

import {makeApplication} from "./app/make-application.js"
import {PastesafeApp} from "./components/pastesafe-app.js"

import {theme} from "./theme.js"

void async function main() {
	const app = makeApplication({
		storage: localStorage,
		update(up) {
			console.log(up)
		},
	})

	registerComponents(themeComponents(theme, {
		PastesafeApp
	}))

	app.actions.createProfile({label: "hello"})
	console.log(app)

}()
