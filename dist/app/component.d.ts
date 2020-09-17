import { LitElement } from "lit-element";
import { AppShare, AppUpdate } from "../types.js";
export { repeat } from "lit-html/directives/repeat.js";
export * from "lit-element";
declare const _appUpdate: unique symbol;
declare const _clear: unique symbol;
declare const _unsubscribe: unique symbol;
export declare class Component extends LitElement {
}
export declare class WiredComponent extends Component {
    readonly share: AppShare;
    get appUpdate(): AppUpdate;
    private [_appUpdate];
    private [_unsubscribe];
    private [_clear];
    connectedCallback(): void;
    disconnectedCallback(): void;
}
