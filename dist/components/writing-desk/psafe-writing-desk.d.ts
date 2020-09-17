import { PsafeWritingDeskProps } from "../../types.js";
import { Component } from "../../app/component.js";
export declare class PsafeWritingDesk extends Component {
    props: PsafeWritingDeskProps;
    message: string;
    messageLink: string;
    get messageLinkPreview(): string;
    private debouncer;
    private previousCopy;
    get recentlyCopied(): boolean;
    render(): import("lit-html/lib/template-result").TemplateResult;
}
