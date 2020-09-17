export declare function renderLabelInput({ label, ready, buttonText, placeholder, onButtonClick, onLabelUpdate, }: {
    label: string;
    ready: boolean;
    buttonText: string;
    placeholder: string;
    onButtonClick: () => void;
    onLabelUpdate: (label: string) => void;
}): import("lit-html/lib/template-result").TemplateResult;
