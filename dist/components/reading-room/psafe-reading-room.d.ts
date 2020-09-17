import { Component } from "../../app/component.js";
import { PsafeReadingRoomProps } from "../../types.js";
export declare class PsafeReadingRoom extends Component {
    props: PsafeReadingRoomProps;
    firstUpdated(): void;
    private sesh;
    private secret;
    private error;
    decryption(): Promise<void>;
    render(): import("lit-html/lib/template-result").TemplateResult;
}
