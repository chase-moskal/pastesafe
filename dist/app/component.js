import { LitElement } from "lit-element";
export { repeat } from "lit-html/directives/repeat.js";
export * from "lit-element";
const _appUpdate = Symbol();
const _clear = Symbol();
const _unsubscribe = Symbol();
export class Component extends LitElement {
}
export class WiredComponent extends Component {
    get appUpdate() {
        return this[_appUpdate];
    }
    [_clear]() {
        if (this[_unsubscribe])
            this[_unsubscribe]();
        this[_unsubscribe] = undefined;
    }
    connectedCallback() {
        var _a;
        super.connectedCallback();
        const { onUpdate } = (_a = this.share) !== null && _a !== void 0 ? _a : {};
        if (!onUpdate)
            throw new Error("share onUpdate missing");
        this[_clear]();
        this[_unsubscribe] = onUpdate(update => {
            this[_appUpdate] = update;
            this.requestUpdate();
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this[_clear]();
    }
}
//# sourceMappingURL=component.js.map