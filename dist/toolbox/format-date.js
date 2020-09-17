import { formatDate as metalFormatDate } from "metalshop/dist/metalfront/toolbox/dates.js";
export function formatDate(date) {
    const { datestring, timestring } = metalFormatDate(date);
    return `${datestring} ${timestring}`;
}
//# sourceMappingURL=format-date.js.map