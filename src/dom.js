import { options } from "./options";

export function create(tag, isSvg) {
    let doc = options.document || document;
    if (tag) {
        return isSvg
            ? doc.createElementNS("http://www.w3.org/2000/svg", tag)
            : doc.createElement(tag);
    } else {
        return doc.createTextNode("");
    }
}

export function root(parent) {
    return parent.shadowRoot || parent;
}
export function remove(parent, child) {
    parent.removeChild(child);
}

export function append(parent, child) {
    parent.appendChild(child);
}

export function replace(parent, newChild, oldChild) {
    parent.replaceChild(newChild, oldChild);
}

export function before(parent, newChild, oldChild) {
    parent.insertBefore(newChild, oldChild);
}
