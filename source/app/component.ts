
import {LitElement} from "lit-element"
import {AppShare, AppUpdate} from "../types.js"

export {repeat} from "lit-html/directives/repeat.js"

export * from "lit-element"

const _appUpdate = Symbol()
const _clear = Symbol()
const _unsubscribe = Symbol()

export class Component extends LitElement {}

export class WiredComponent extends Component {
	readonly share: AppShare

	get appUpdate(): AppUpdate {
		return this[_appUpdate]
	}

	private [_appUpdate]: AppUpdate
	private [_unsubscribe]: () => void
	private [_clear]() {
		if (this[_unsubscribe]) this[_unsubscribe]()
		this[_unsubscribe] = undefined
	}

	connectedCallback() {
		super.connectedCallback()

		const {onUpdate} = this.share ?? {}
		if (!onUpdate) throw new Error("share onUpdate missing")

		this[_clear]()
		this[_unsubscribe] = onUpdate(update => {
			this[_appUpdate] = update
			this.requestUpdate()
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this[_clear]()
	}
}
