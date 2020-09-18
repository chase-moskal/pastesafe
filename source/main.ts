
import {pubsub} from "metalshop/dist/toolbox/pubsub.js"
import {objectMap} from "metalshop/dist/toolbox/object-map.js"
import {ConstructorFor} from "metalshop/dist/metalfront/types.js"
import {share} from "metalshop/dist/metalfront/framework/share.js"
import {themeComponents} from "metalshop/dist/metalfront/framework/theme-components.js"
import {registerComponents} from "metalshop/dist/metalfront/toolbox/register-components.js"

import {makeAppModel} from "./app/make-app-model.js"
import {PsafeDashboard} from "./components/psafe-dashboard/psafe-dashboard.js"

import {theme} from "./theme.js"
import {AppUpdateListener, AppShare} from "./types.js"

void async function main() {
	const appUpdate = pubsub<AppUpdateListener>()

	const app = makeAppModel({
		storage: localStorage,
		onUpdate: appUpdate.publish,
	})

	const appShare: AppShare = Object.freeze({
		onUpdate: appUpdate.subscribe
	})

	function wireComponentShares(components: {[key: string]: ConstructorFor}) {
		return objectMap(components, Component => share(Component, () => appShare))
	}

	registerComponents(themeComponents(theme, wireComponentShares({
		PsafeDashboard,
	})))

	app.start()
}()
