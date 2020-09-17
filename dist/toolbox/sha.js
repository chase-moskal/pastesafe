var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function curryHash(algo) {
    return (bytes) => __awaiter(this, void 0, void 0, function* () {
        const buffer = yield crypto.subtle.digest(algo, bytes);
        return new Uint8Array(buffer);
    });
}
export const sha256 = curryHash("SHA-256");
export const sha512 = curryHash("SHA-512");
//# sourceMappingURL=sha.js.map