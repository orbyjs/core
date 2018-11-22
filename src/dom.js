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
export function remove(parent, child, useShadowRoot) {
    parent.removeChild(child);
}

export function append(parent, child, useShadowRoot) {
    parent.appendChild(child);
}

export function replace(parent, newChild, oldChild, useShadowRoot) {
    parent.replaceChild(newChild, oldChild);
}
