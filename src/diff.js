import { VDom } from "./vdom";
import { create, remove, append, replace, root, before } from "./dom";
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

export let IGNORE = /^(context|children|(on){1}(create|update|remove)(d){0,1}|xmlns|key)$/;
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
    return diff(root(parent), child, false, next, context, isSvg);
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
    if (vdom.remove && prop !== "onremoved") return;
    if (prop === "onremove") vdom.remove = true;
    if (prop === "onremoved") vdom.removed = true;
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
 * note the use of `recollectComponent`, this function allows to clean the
 * effects associated with the elimination of the component.
 * @param {Function} handler
 * @param {array} args - allows to issue the handler only when one of the properties is different from the previous one
 */
export function useEffect(handler, args = []) {
    let setup,
        use = CURRENT_COMPONENT;
    args = [].concat(args);
    let [state] = useState(() => {
        setup = true;
        return { args };
    });

    if (!setup) {
        if (
            state.args.length &&
            !state.args.some((arg, index) => args[index] !== arg)
        ) {
            handler = undefined;
        } else {
            recollectComponent([use]);
        }
        state.args = args;
    }
    use.effects.updated.push(handler);
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
        this.effects = { remove: [], updated: [] };
        this.context = {};
        this.prevent = false;
        this.render = () => {
            //if (this.prevent) return this.base;
            if (this.base[REMOVE]) return;

            CURRENT_KEY_STATE = 0;
            CURRENT_COMPONENT = this;

            this.effects.updated = [];

            let nextStateRender = tag(this.props, this.context);

            CURRENT_COMPONENT = false;

            this.base = diff(
                this.parent,
                this.base,
                false,
                nextStateRender,
                this.context,
                isSvg,
                deep + 1,
                currentComponents
            );

            this.effects.remove = this.effects.updated.map((handler, index) =>
                handler ? handler() : this.effects.remove[index]
            );

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
    nodeSibling,
    next,
    context = {},
    isSvg,
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
        let nextType = typeof next;
        next = new VDom(
            "",
            {},
            nextType === "string" || nextType === "number" ? next : ""
        );
    }

    let addContext = next.props.context;

    context = addContext ? { ...context, ...addContext } : context;

    isSvg = next.tag === "svg" || isSvg;

    if (components[deep] && components[deep].tag !== next.tag) {
        recollectComponent(components.splice(deep));
    }

    if (typeof next.tag === "function") {
        if ((components[deep] || {}).tag !== next.tag) {
            components[deep] = new Component(next.tag, isSvg, deep, components);
        }
        component = components[deep];
        next = next.clone(prev.tag || "");
    }

    if (prev.tag !== next.tag) {
        base = create(next.tag, isSvg);
        if (node) {
            if (!component && next.tag) {
                while (node.firstChild) {
                    append(base, node.firstChild);
                }
            }
            if (!component && prev.tag) {
                recollectNodeTree(node);
            }
            replace(parent, base, node);
        } else {
            (nodeSibling ? before : append)(parent, base, nodeSibling);
        }
        isCreate = true;
        if (!component) emit(next, "oncreate", base);
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

        return component.render();
    } else if (next.tag) {
        withUpdate =
            emit(next, "onupdate", base, prev.props, next.props) !== false;
        if (isCreate || withUpdate) {
            diffProps(
                base,
                prev.tag === next.tag ? prev.props : {},
                next.props,
                isSvg
            );
            let children = next.props.children,
                nextParent = next.props.scoped ? root(base) : base,
                childNodes = nextParent.childNodes,
                childrenLength = children.length,
                childNodesLenght = childNodes.length,
                childrenByKey = {},
                index = 0;
            for (let index = 0; index < childNodesLenght; index++) {
                let node = childNodes[index],
                    prev = node[PREVIOUS],
                    useKey = prev && prev.key !== undefined,
                    key = useKey ? prev.key : index;

                childrenByKey[key] = {
                    node,
                    index,
                    useKey
                };
            }
            for (let i = 0; i < childrenLength; i++) {
                let child = children[i],
                    useKey = child instanceof VDom && child.key !== undefined,
                    key = useKey ? child.key : i,
                    childNode = childrenByKey[key] || {};

                if (childNode.useKey && childNode.node !== childNodes[i]) {
                    before(nextParent, childNode.node, childNodes[i]);
                }

                diff(
                    nextParent,
                    childNode.node,
                    childNodes[i],
                    child,
                    context,
                    isSvg
                );

                delete childrenByKey[key];
            }
            for (let key in childrenByKey) {
                let childNode = childrenByKey[key];
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

    emit(next, isCreate ? "oncreated" : "onupdated", base);

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
        length = keys.length,
        ignore = {};

    for (let i = 0; i < length; i++) {
        let prop = keys[i],
            prevValue = prev[prop],
            nextValue = next[prop];

        if (ignore[prop] || prevValue === nextValue || IGNORE.test(prop))
            continue;

        ignore[prop] = true;

        if (prop === "class" && !svg) {
            prop = "className";
            nextValue = nextValue || "";
            prevValue = prevValue || "";
        }

        if ("scoped" === prop && "attachShadow" in node) {
            node.attachShadow({ mode: nextValue ? "open" : "closed" });
            continue;
        }

        let isFnPrev = typeof prevValue === "function",
            isFnNext = typeof nextValue === "function";

        if (isFnPrev || isFnNext) {
            prop = prop.replace(/on(\w)/, (all, letter) =>
                letter.toLowerCase()
            );
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
                node[LISTENERS][prop][1] = nextValue;
            }
        } else if (prop in next) {
            if ((prop in node && !isSvg) || (isSvg && prop === "style")) {
                if (prop === "style") {
                    if (typeof nextValue === "object") {
                        let prevStyle = prevValue || {},
                            nextStyle = nextValue;
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
                        node.style.cssText = nextValue;
                    }
                } else {
                    node[prop] = nextValue;
                }
            } else {
                isSvg
                    ? node.setAttributeNS(null, prop, nextValue)
                    : node.setAttribute(prop, nextValue);
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
function recollectNodeTree(node) {
    let prev = node[PREVIOUS],
        components = node[COMPONENTS],
        children = node.childNodes,
        length;

    if (!prev) return;

    node[REMOVE] = true;

    emit(prev, "onremove", node);

    recollectComponent(components);

    length = children.length;
    for (let i = 0; i < length; i++) {
        recollectNodeTree(children[i]);
    }

    emit(prev, "onremoved", node);
}

function recollectComponent(components) {
    let length = components.length;
    for (let i = 0; i < length; i++) {
        let component = components[i],
            effectsRemove = component.effects.remove,
            effectsLength = effectsRemove.length;
        for (let i = 0; i < effectsLength; i++) {
            if (effectsRemove[i]) effectsRemove[i]();
        }
        component.effects.remove = [];
    }
}
