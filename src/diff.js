import { VDom } from "./vdom";
import { create, remove, append, replace, root } from "./dom";
export { h } from "./vdom";

export let options = {
    delay: 1
};

export let COMPONENTS = "__components__";
/**
 * Master is the mark to store the previous state
 * and if the node is controlled by one or more components
 */
export let PREVIOUS = "__previous__";
/**
 * Each time a component is removed from the dom,
 * the property is marked as true
 */
export let REMOVE = "__remove__";

export let LISTENERS = "__listeners__";
/**
 * Special properties of virtual dom,
 * these are ignored from the diffProps process,
 * since it is part of the component's life cycle
 */

export let IGNORE = /^(context|state|children|(create|update|remove)(d){0,1}|xmlns)$/;
/**
 * It allows to print the status of virtual dom on the planned configuration
 * @param {VDom} next - the next state of the node
 * @param {HTMLElement} parent - the container of the node
 * @param {HTMLElement} [child]  - the ancestor of the node
 * @param {Object} [context] - the context of the node
 * @param {boolean} [isSvg] - check if the node belongs to a svg unit, to control it as such
 * @returns {HTMLElement} - The current node
 */
export function render(next, parent, child, context, isSvg) {
    return diff(root(parent), child, next, context, isSvg);
}

export function defer(handler) {
    setTimeout(handler, options.delay);
}
/**
 *
 * @param {Function} component  - Function that controls the node
 * @param {*} [currentState] - The initial state of the component
 * @param {Boolean} [isSvg] - Create components for a group of svg
 * @return {HTMLElement} - Returns the current component node
 */
export function Component(tag, state, isSvg, deep, key, components) {
    this.tag = tag;
    this.state = state;
    this.context = {};
    this.prevent = false;
    this.render = (parent, base) => {
        let set = state => {
                this.state = state;
                if (!base[REMOVE] && !this.prevent) {
                    this.prevent = true;
                    defer(() => {
                        this.render(parent, base);
                        this.prevent = false;
                    });
                }
            },
            get = () => this.state;
        return (base = diff(
            parent,
            base,
            this.tag(this.props, { set, get }, this.context),
            this.context,
            isSvg,
            deep + 1,
            key + 1,
            components
        ));
    };
}
/**
 * It allows to print the status of virtual dom on the planned configuration
 * @param {HTMLElement} parent - the container of the node
 * @param {HTMLElement} [node]  - the ancestor of the node
 * @param {VDom} next - the next state of the node
 * @param {Object} [context] - the context of the node
 * @param {boolean} [isSvg] - check if the node belongs to a svg unit, to control it as such
 * @param {number} [deep] - this is a depth marker used to generate an index to store the state of the component
 * @param {number} [currentKey] - when generating a component of high order, it has a currentKey
 *                                other than 0, this allows to point to the state of the component correctly
 * @param {object} [currentComponents] - the functional components are stored in an object created by the first component
 * @returns {HTMLElement} - The current node
 */

export function diff(
    parent,
    node,
    next,
    context = {},
    isSvg,
    deep = 0,
    currentKey = 0,
    currentComponents = {}
) {
    let prev = (node && node[PREVIOUS]) || new VDom(),
        components = (node && node[COMPONENTS]) || currentComponents,
        base = node,
        isCreate,
        component,
        withUpdate = true;

    if (prev === next) return base;

    if (!(next instanceof VDom)) {
        next = new VDom("", {}, next);
    }

    let children = next.props.children,
        addContext = next.props.context;

    context = addContext ? { ...context, ...addContext } : context;

    isSvg = next.tag === "svg" || isSvg;

    if (components[currentKey] && components[currentKey].tag !== next.tag) {
        delete components[currentKey];
    }

    if (typeof next.tag === "function") {
        if ((components[currentKey] || {}).tag !== next.tag) {
            components[currentKey] = new Component(
                next.tag,
                next.props.state,
                isSvg,
                deep,
                currentKey,
                components
            );
        }
        component = components[currentKey];
        next = next.clone(prev.tag || (isSvg ? "g" : ""));
    }

    if (prev.tag !== next.tag) {
        base = create(next.tag, isSvg);
        if (node) {
            if (!component && next.tag) {
                let length = children.length;
                while (node.firstChild) {
                    if (!length--) break;
                    append(base, node.firstChild);
                }
            }
            replace(parent, base, node);
            if (!component && prev.tag) emitRemove(node);
        } else {
            append(parent, base);
        }
        isCreate = true;
        next.emit("create", base);
    }

    if (component) {
        component.props = next.props;
        component.context = context;
        if (deep && component.prevent) {
            return base;
        }
        return component.render(parent, base);
    } else if (next.tag) {
        withUpdate =
            next.emit("update", base, prev.props, next.props) !== false;
        if (isCreate || withUpdate) {
            diffProps(
                base,
                prev.tag === next.tag ? prev.props : {},
                next.props,
                isSvg
            );
            let nextParent = next.props.scoped ? root(base) : base,
                childNodes = nextParent.childNodes,
                move = 0,
                length = Math.max(children.length, childNodes.length);
            for (let i = 0; i < length; i++) {
                let childI = i - move;
                if (i in children) {
                    diff(
                        nextParent,
                        childNodes[childI],
                        children[i],
                        context,
                        isSvg
                    );
                } else {
                    remove(nextParent, childNodes[childI]);
                    move++;
                }
            }
        }
    } else {
        if (prev.props.children !== next.props.children) {
            base.textContent = next.props.children;
        }
    }

    base[PREVIOUS] = withUpdate ? next : prev;
    base[COMPONENTS] = components;

    next.emit(isCreate ? "created" : "updated", base);

    return base;
}
/**
 * Update or delete the attributes and events of a node
 * @param {HTMLElement} node - Node to assign changes
 * @param {Object} prev - Previous status of attributes
 * @param {Object} next - next status of attributes
 * @param {Boolean} [isSvg] - If it belongs to svg tree
 */
export function diffProps(node, prev, next, isSvg) {
    let prevKeys = Object.keys(prev),
        nextKeys = Object.keys(next),
        keys = prevKeys.concat(nextKeys),
        define = {};

    for (let i = 0; i < keys.length; i++) {
        let prop = keys[i];

        if (define[prop] || prev[prop] === next[prop] || IGNORE.test(prop))
            continue;

        define[prop] = true;

        if ("scoped" === prop && "attachShadow" in node) {
            node.attachShadow({ mode: next[prop] ? "open" : "closed" });
            continue;
        }

        let isFnPrev = typeof prev[prop] === "function",
            isFnNext = typeof next[prop] === "function";

        if (isFnPrev || isFnNext) {
            if (!isFnNext && isFnPrev) {
                node.removeEventListener(prop, node[LISTENERS][prop][0]);
            }
            if (isFnNext) {
                if (!isFnPrev) {
                    node[LISTENERS] = node[LISTENERS] || {};
                    if (!node[LISTENERS][prop]) {
                        node[LISTENERS][prop] = [
                            event => {
                                node[LISTENERS][prop][1](event);
                            }
                        ];
                    }
                    node.addEventListener(prop, node[LISTENERS][prop][0]);
                }
                node[LISTENERS][prop][1] = next[prop];
            }
        } else if (prop in next) {
            if ((prop in node && !isSvg) || (isSvg && prop === "style")) {
                if (prop === "style") {
                    if (typeof next[prop] === "object") {
                        let prevStyle = prev[prop] || {},
                            nextStyle = next[prop];
                        for (let prop in nextStyle) {
                            if (prevStyle[prop] !== nextStyle[prop]) {
                                if (prop[0] === "-") {
                                    node.style.setProperty(
                                        prop,
                                        nextStyle[prop]
                                    );
                                } else {
                                    node.style[prop] = nextStyle[prop];
                                }
                            }
                        }
                        // next[prop] = { ...prevStyle, ...nextStyle };
                    } else {
                        node.style.cssText = next[prop];
                    }
                } else {
                    node[prop] = next[prop];
                }
            } else {
                isSvg
                    ? node.setAttributeNS(null, prop, next[prop])
                    : node.setAttribute(prop, next[prop]);
            }
        } else {
            node.removeAttribute(prop);
        }
    }
}
/**
 * Issues the deletion of node and its children
 * @param {HTMLElement} base
 */
export function emitRemove(base) {
    let { prev = new VDom() } = (base && base[MASTER]) || {},
        children = base.childNodes;
    base[REMOVE] = true;
    prev.emit("remove", base);
    for (let i = 0; i < children.length; i++) {
        emitRemove(children[i]);
    }
    prev.emit("removed", base);
}
