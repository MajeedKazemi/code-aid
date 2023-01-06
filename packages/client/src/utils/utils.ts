export const highlightCode = (
    code: string,
    className: string = "inline-code"
) => code.replace(/`([^`]+)`/g, `<span class="${className}">$1</span>`);
