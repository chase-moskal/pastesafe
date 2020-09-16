
import {makeApplication} from "./app/make-application.js"

void async function main() {

	const app = makeApplication({
		storage: localStorage,
		update(up) {
			console.log(up)
		},
	})

	app.actions.createProfile({label: "hello"})
	console.log(app)

}()
