export function create(tag, isSvg) {
    if (tag) {
        return isSvg
            ? document.createElementNS("http://www.w3.org/2000/svg", tag)
            : document.createElement(tag);
    } else {
        return document.createTextNode("");
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

export function toggle(parent, newChild, oldChild) {
    let newWithNext = newChild.nextSibling,
        oldWithNext = oldChild.nextSibling;

    if (oldWithNext) {
        before(parent, newChild, oldChild);
    }

    (newWithNext ? before : append)(parent, oldChild, newWithNext);
}
