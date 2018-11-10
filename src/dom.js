export function create(tag, isSvg) {
    return isSvg
        ? document.createElementNS("http://www.w3.org/2000/svg", tag)
        : tag
            ? document.createElement(tag)
            : document.createTextNode("");
}

export function root(parent) {
    return parent.shadowRoot || parent;
}
export function remove(parent, child) {
    root(parent).removeChild(child);
}

export function append(parent, child) {
    root(parent).appendChild(child);
}

export function replace(parent, newChild, oldChild) {
    root(parent).replaceChild(newChild, oldChild);
}
