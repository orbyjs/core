import { VDom } from "./vdom";
import { create, remove, append, replace, root, toggle } from "./dom";
export { h } from "./vdom";

let CURRENT_COMPONENT;
let CURRENT_KEY_STATE;

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

export let IGNORE = /^(context|state|children|(create|update|remove)(d){0,1}|xmlns|key)$/;
/**
 * It allows to print the status of virtual dom on the planned configuration
 * @param {VDom} next - the next state of the node
 * @param {HTMLElement} parent - the container of the node
 * @param {HTMLElement} [child]  - the ancestor of the node
 * @param {object} [context] - the context of the node
 * @param {boolean} [isSvg] - check if the node belongs to a svg unit, to control it as such
 * @returns {HTMLElement} - The current node
 */
export function render(next, parent, child, context, isSvg) {
    return diff(root(parent), child, next, context, isSvg);
}
/**
 * execute a callback based on setTimeout, this is to avoid an
 * overload before the mamipulation of the state
 * @param {Function} handler
 */
export function defer(handler) {
    setTimeout(handler, options.delay);
}
/**
 * It allows to execute a property of the virtual-dom,
 * this function has a use focused on the life cycle of the node
 * @param {VDom} vdom
 * @param {string} prop
 * @param  {...any} args
 */
export function emit(vdom, prop, ...args) {
    if (vdom.removed) return;
    if (vdom.remove && prop !== "removed") return;
    if (prop === "remove") vdom.remove = true;
    if (prop === "removed") vdom.removed = true;
    if (vdom.props[prop]) vdom.props[prop](...args);
}
/**
 * Allows you to add an observer status of changes to the functional component
 * @param {*} initialState - Initial state to register
 */
export function useState(initialState) {
    let key = CURRENT_KEY_STATE++,
        use = CURRENT_COMPONENT;
    if (!(key in use.states)) {
        use.states.push(
            typeof initialState === "function" ? initialState() : initialState
        );
    }
    return [
        use.states[key],
        nextState => {
            use.states[key] = nextState;
            if (use.prevent) return;
            defer(() => {
                use.render();
                use.prevent = false;
            });
            use.prevent = true;
        },
        () => use.states[key]
    ];
}
/**
 * allows to add an observer effect before the changes of the component
 * @param {Function} handler
 */
export function useEffect(handler) {
    CURRENT_COMPONENT.effects[0].push(handler);
}
/**
 *
 * @param {Function} component  - Function that controls the node
 * @param {boolean} isSvg - Create components for a group of svg
 * @param {number} deep - Depth of the component
 * @param {number} currentKey - current depth level
 * @param {object} currentComponents
 */
export class Component {
    constructor(tag, isSvg, deep, currentComponents) {
        this.base;
        this.parent;
        this.tag = tag;
        this.props = {};
        this.states = [];
        this.effects = [];
        this.context = {};
        this.prevent = false;
        this.render = rebuild => {
            //if (this.prevent) return this.base;
            if (this.base[REMOVE]) return;

            CURRENT_KEY_STATE = 0;
            CURRENT_COMPONENT = this;

            this.effects = [[], []];

            let nextStateRender = tag(this.props, this.context);

            CURRENT_COMPONENT = false;

            this.base = diff(
                this.parent,
                this.base,
                nextStateRender,
                this.context,
                isSvg,
                rebuild,
                deep + 1,
                currentComponents
            );

            this.effects[1] = this.effects[0].map(handler => handler());

            return this.base;
        };
    }
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
    rebuild,
    deep = 0,
    currentComponents = []
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

    /**
     *
     */
    if (components[deep] && components[deep].tag !== next.tag) {
        removeComponents(components.splice(deep));
    }

    if (typeof next.tag === "function") {
        if ((components[deep] || {}).tag !== next.tag) {
            components[deep] = new Component(next.tag, isSvg, deep, components);
        }
        component = components[deep];
        next = next.clone(prev.tag || "");
    }

    if (prev.tag !== next.tag || rebuild) {
        base = create(next.tag, isSvg);
        if (node) {
            if (!component && next.tag) {
                let length = children.length;
                while (node.firstChild) {
                    if (!length--) break;
                    append(base, node.firstChild);
                }
            }
            if (!component && prev.tag) {
                recollectNodeTree(node);
            }
            replace(parent, base, node);
        } else {
            append(parent, base);
        }
        isCreate = true;
        if (!component) emit(next, "create", base);
    }

    if (component) {
        component.base = base;
        component.parent = parent;
        component.props = next.props;
        component.context = context;

        //if (deep && component.prevent) {
        if (component.prevent) {
            return component.base;
        }

        return component.render(rebuild);
    } else if (next.tag) {
        withUpdate =
            emit(next, "update", base, prev.props, next.props) !== false;
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
                length,
                ignore = {},
                prevChildrenKeys = {};

            for (let i = 0; i < childNodes.length; i++) {
                let node = childNodes[i],
                    prev = node[PREVIOUS],
                    useKey = prev && prev.key !== undefined,
                    key = useKey ? prev.key : i;
                prevChildrenKeys[key] = {
                    node,
                    index: i,
                    useKey
                };
            }

            for (let i = 0; i < children.length; i++) {
                let child = children[i],
                    useKey = child instanceof VDom && child.key !== undefined,
                    key = useKey ? child.key : i,
                    childNode = prevChildrenKeys[key] || {};

                if (childNode.useKey && childNode.index !== i) {
                    toggle(nextParent, childNode.node, childNodes[i]);
                }

                diff(
                    nextParent,
                    childNode.node,
                    child,
                    context,
                    isSvg,
                    useKey ? child.key !== key : rebuild
                );

                delete prevChildrenKeys[key];
            }
            for (let key in prevChildrenKeys) {
                let childNode = prevChildrenKeys[key];
                recollectNodeTree(childNode.node);
                remove(nextParent, childNode.node);
            }
        }
    } else {
        if (prev.props.children !== next.props.children) {
            base.textContent = next.props.children;
        }
    }

    base[PREVIOUS] = withUpdate ? next : prev;
    base[COMPONENTS] = components;

    emit(next, isCreate ? "created" : "updated", base);

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
 * @param {HTMLElement} node
 */
export function recollectNodeTree(node) {
    let prev = node[PREVIOUS],
        components = node[COMPONENTS],
        children = node.childNodes;

    if (!prev) return;

    node[REMOVE] = true;

    emit(prev, "remove", node);

    removeComponents(components);

    for (let i = 0; i < children.length; i++) {
        recollectNodeTree(children[i]);
    }

    emit(prev, "removed", node);
}

export function removeComponents(components) {
    for (let i = 0; i < components.length; i++) {
        let component = components[i],
            effectsRemove = component.effects[1];
        for (let i = 0; i < effectsRemove.length; i++) {
            if (effectsRemove[i]) effectsRemove[i]();
        }
    }
}
