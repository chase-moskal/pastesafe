import { Component } from "../../app/component.js";
import { SessionManagerProps } from "../../types.js";
export declare class PsafeSessionManager extends Component {
    props: SessionManagerProps;
    private _actual_sessionDraft;
    private get _sessionDraft();
    private set _sessionDraft(value);
    render(): import("lit-html/lib/template-result").TemplateResult;
}
