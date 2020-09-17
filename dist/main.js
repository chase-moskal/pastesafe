var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { test } from "cynic";
import suite from "./tests.test.js";
import { pubsub } from "metalshop/dist/toolbox/pubsub.js";
import { objectMap } from "metalshop/dist/toolbox/object-map.js";
import { share } from "metalshop/dist/metalfront/framework/share.js";
import { themeComponents } from "metalshop/dist/metalfront/framework/theme-components.js";
import { registerComponents } from "metalshop/dist/metalfront/toolbox/register-components.js";
import { PsafeApp } from "./components/psafe-app.js";
import { makeAppModel } from "./app/make-app-model.js";
import { PsafeDashboard } from "./components/dashboard/psafe-dashboard.js";
import { PsafeReadingRoom } from "./components/reading-room/psafe-reading-room.js";
import { PsafeWritingDesk } from "./components/writing-desk/psafe-writing-desk.js";
import { PsafeSessionManager } from "./components/dashboard/psafe-session-manager.js";
import { theme } from "./theme.js";
void function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const appUpdate = pubsub();
        const app = makeAppModel({
            storage: localStorage,
            onUpdate: appUpdate.publish,
        });
        const onHashChange = () => app.hashChange(location.href);
        window.addEventListener("hashchange", onHashChange);
        const appShare = Object.freeze({
            onUpdate: appUpdate.subscribe
        });
        function wireComponentShares(components) {
            return objectMap(components, Component => share(Component, () => appShare));
        }
        registerComponents(themeComponents(theme, Object.assign(Object.assign({}, wireComponentShares({ PsafeApp })), { PsafeDashboard,
            PsafeReadingRoom,
            PsafeWritingDesk,
            PsafeSessionManager })));
        app.start();
        onHashChange();
    });
}();
void function runTestsOnLocalhost() {
    return __awaiter(this, void 0, void 0, function* () {
        if (/^https?:\/\/localhost(|:\d{2,4})$/.test(location.origin)) {
            const { report, errors } = yield test("pastesafe test suite", suite);
            console.log(report);
            for (const error of errors)
                console.error(error);
        }
    });
}();
//# sourceMappingURL=main.js.map