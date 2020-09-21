
import {test} from "cynic"
import suite from "./tests.test.js"

import {pubsub} from "metalshop/dist/toolbox/pubsub.js"
import {objectMap} from "metalshop/dist/toolbox/object-map.js"
import {ConstructorFor} from "metalshop/dist/metalfront/types.js"
import {share} from "metalshop/dist/metalfront/framework/share.js"
import {themeComponents} from "metalshop/dist/metalfront/framework/theme-components.js"
import {registerComponents} from "metalshop/dist/metalfront/toolbox/register-components.js"

import {PsafeApp} from "./components/psafe-app.js"
import {makeAppModel} from "./app/make-app-model.js"
import {PsafeDashboard} from "./components/dashboard/psafe-dashboard.js"
import {PsafeWritingDesk} from "./components/writing-desk/psafe-writing-desk.js"
import {PsafeSessionManager} from "./components/dashboard/psafe-session-manager.js"

import {theme} from "./theme.js"
import {AppUpdateListener, AppShare} from "./types.js"

void async function main() {
	const appUpdate = pubsub<AppUpdateListener>()

	const app = makeAppModel({
		storage: localStorage,
		onUpdate: appUpdate.publish,
	})

	const onHashChange = () => app.hashChange(location.href)
	window.addEventListener(
		"hashchange",
		onHashChange,
	)

	const appShare: AppShare = Object.freeze({
		onUpdate: appUpdate.subscribe
	})

	function wireComponentShares(components: {[key: string]: ConstructorFor}) {
		return objectMap(components, Component => share(Component, () => appShare))
	}

	registerComponents(themeComponents(theme, {
		...wireComponentShares({PsafeApp}),
		PsafeDashboard,
		PsafeWritingDesk,
		PsafeSessionManager,
	}))

	app.start()
	onHashChange()
}()

void async function runTestsOnLocalhost() {
	if (/^https?:\/\/localhost(|:\d{2,4})$/.test(location.origin)) {
		const {report, errors} = await test("pastesafe test suite", suite)
		console.log(report)
		for (const error of errors) console.error(error)
	}
}()
