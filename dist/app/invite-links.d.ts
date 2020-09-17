import { InviteLink } from "../types.js";
export declare const messagePrefix = "i";
export declare const inviteRegex: RegExp;
export declare const sessionIdLength: number;
export declare function encodeInviteLink({ baseUrl, sessionId, sessionPublicKey, }: InviteLink): string;
export declare function decodeInviteLink(link: string): InviteLink;
