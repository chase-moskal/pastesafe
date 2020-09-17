
import {themeComponents} from "metalshop/dist/metalfront/framework/theme-components.js"
import {registerComponents} from "metalshop/dist/metalfront/toolbox/register-components.js"

import {makeAppModel} from "./app/make-app-model.js"
import {PastesafeApp} from "./components/pastesafe-app.js"

import {theme} from "./theme.js"

void async function main() {
	const app = makeAppModel({
		storage: localStorage,
		onUpdate: update => console.log("app update", update)
	})

	registerComponents(themeComponents(theme, {
		PastesafeApp
	}))

	app.start()
	app.actions.createProfile({label: "hello"})
}()
