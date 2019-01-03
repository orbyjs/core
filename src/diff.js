import { Vtag } from "./vtag";
import { create, remove, append, replace, root, before } from "./dom";
import { options } from "./options";

let CURRENT_COMPONENT;
let CURRENT_KEY_STATE;

export let COMPONENTS = "__COMPONENTS__";

/**static_render
export let STATIC_RENDER = "__STATIC_RENDER__";
*/

/**
 * Master is the mark to store the previous state
 * and if the node is controlled by one or more components
 */
export let PREVIOUS = "__PREVIOUS__";
/**
 * Each time a component is removed from the dom,
 * the property is marked as true
 */
export let REMOVE = "__REMOVE__";

export let HANDLERS = "__HANDLERS__";

/**
 * Special properties of virtual dom,
 * these are ignored from the updateProperties process,
 * since it is part of the component's life cycle
 */

export let IGNORE = /^(context|children|(on){1}(Create|Update|Remove)(d){0,1}|xmlns|key|ref)$/;

/**
 * It allows to print the status of virtual dom on the planned configuration
 * @param {Vtag} next - the next state of the node
 * @param {HTMLElement} parent - the container of the node
 * @param {HTMLElement} [child]  - the ancestor of the node
 * @param {object} [context] - the context of the node
 * @param {boolean} [isSvg] - check if the node belongs to a svg unit, to control it as such
 * @returns {HTMLElement} - The current node
 */
export function render(next, parent, child, context, isSvg) {
    return updateElement(root(parent), child, false, next, context, isSvg);
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
 * @param {Vtag} Vtag
 * @param {string} prop
 * @param  {...any} args
 */
export function emit(Vtag, prop, ...args) {
    if (Vtag.removed) return;
    if (Vtag.remove && prop !== "onRemoved") return;
    if (prop === "onRemove") Vtag.remove = true;
    if (prop === "onRemoved") Vtag.removed = true;
    if (Vtag.props[prop]) Vtag.props[prop](...args);
}

export function getPrevious(node, create = true) {
    if (node) {
        if (node[PREVIOUS]) {
            return node[PREVIOUS];
        } else {
            /**static_render
            // STATIC RENDER
            // it is a way to homologate the behavior of server render, 
            // it allows transoforming existing nodes in the document, in valid vtag for the diff process.
            // `render(vtag,elementContainer,elementStaticRender)`

            let tag = "",
                props = {},
                children = [];
            if (node instanceof Text) {
                children = [node.textContent];
            } else {
                let isScoped,
                    attrs = node.attributes,
                    childrenReal = node.childNodes,
                    childrenRealLength = childrenReal.length,
                    childrenCountRemove = 0,
                    attrsLength = attrs.length,
                    supportAttachShadow = "attachShadow" in node;

                tag = node.tagName.toLowerCase();

                for (let i = 0; i < attrsLength; i++) {
                    let { name, value } = attrs[i];
                    props[name] = name === "value" ? value : value || true;
                    if (name === "scoped") isScoped = true;
                }
                if (isScoped && supportAttachShadow) {
                    if (!node.shadowRoot) node.attachShadow({ mode: "open" });
                }

                for (let i = 0; i < childrenRealLength; i++) {
                    let childReal = childrenReal[i - childrenCountRemove];
                    if (isScoped && supportAttachShadow) {
                        node.shadowRoot.appendChild(childReal);
                        childrenCountRemove++;
                    }
                    children.push(getPrevious(childReal));
                }
            }
            node[STATIC_RENDER] = true;
            node[COMPONENTS] = [];
            return (node[PREVIOUS] = new Vtag(tag, props, children));
            */
        }
    }
    return create ? new Vtag() : false;
}

export function getComponents(node, components) {
    return node && node[COMPONENTS];
}

/**
 * Allows you to add an observer status of changes to the functional component
 * @param {*} initialState - Initial state to register
 */
export function useState(initialState) {
    let key = CURRENT_KEY_STATE++,
        use = CURRENT_COMPONENT;
    if (!use) {
        throw new Error(
            "the hooks can only be called from an existing functional component in the diff queue"
        );
    }
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
 * note the use of `recollectComponentsEffects`, this function allows to clean the
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
            use.effects.prevent[use.effects.updated.length] = true;
        } else {
            recollectComponentsEffects([use]);
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
        this.isCreate = true;
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
            this.effects.prevent = {};
            let nextStateRender = tag(this.props, this.context);

            CURRENT_COMPONENT = false;

            this.base = updateElement(
                this.parent,
                this.base,
                false,
                nextStateRender,
                this.context,
                isSvg,
                this.isCreate,
                deep + 1,
                currentComponents
            );

            this.effects.remove = this.effects.updated.map((handler, index) =>
                this.effects.prevent[index]
                    ? this.effects.remove[index]
                    : handler()
            );

            this.isCreate = false;

            return this.base;
        };
    }
}

/**
 * It allows to print the status of virtual dom on the planned configuration
 * @param {HTMLElement} parent - the container of the node
 * @param {HTMLElement} [node]  - the ancestor of the node
 * @param {HTMLElement} [nodeSibling]  - allows using the before method in replacement of append, if the node is created
 * @param {Vtag} next - the next state of the node
 * @param {Object} [context] - the context of the node
 * @param {boolean} [isSvg] - check if the node belongs to a svg unit, to control it as such
 * @param {number} [deep] - this is a depth marker used to generate an index to store the state of the component
 * @param {object} [currentComponents] - the functional components are stored in an object created by the first component
 * @returns {HTMLElement} - The current node
 */

export function updateElement(
    parent,
    node,
    nodeSibling,
    next,
    context = {},
    isSvg,
    isCreate,
    deep = 0,
    currentComponents = []
) {
    let prev = getPrevious(node),
        components = getComponents(node) || currentComponents,
        base = node,
        component,
        withUpdate = true;

    if (prev === next) return base;

    if (!(next instanceof Vtag)) {
        let nextType = typeof next;
        next = new Vtag("", {}, [
            nextType === "string" || nextType === "number" ? next : ""
        ]);
    }

    let addContext = next.props.context;

    context = addContext ? { ...context, ...addContext } : context;

    isSvg = next.tag === "svg" || isSvg;

    if (components[deep] && components[deep].tag !== next.tag) {
        recollectComponentsEffects(components.splice(deep));
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
            if (!component && prev.tag) {
                recollectNodeTree(node);
            }
            replace(parent, base, node);
        } else {
            (nodeSibling ? before : append)(parent, base, nodeSibling);
        }
        isCreate = true;
    } else {
        if (next.static) return base;
    }

    if (next.ref) next.ref.current = base;
    /**static_render
    if (base[STATIC_RENDER]) {
        isCreate = true;
        base[STATIC_RENDER] = false;
    }
    */

    if (isCreate && !component) {
        base[REMOVE] = false;
        emit(next, "onCreate", base);
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
            emit(next, "onUpdate", base, prev.props, next.props) !== false;
        if (isCreate || withUpdate) {
            updateProperties(
                base,
                prev.tag === next.tag ? prev.props : {},
                next.props,
                isSvg
            );
            let childrenVtag = next.children,
                childrenVtagKeys = next.keys,
                nextParent = next.props.scoped ? root(base) : base,
                childrenReal = nextParent.childNodes,
                childrenVtagLength = childrenVtag.length,
                childrenRealLength = childrenReal.length,
                childrenByKeys = {},
                childrenCountRemove = 0;

            for (let index = 0; index < childrenRealLength; index++) {
                let node = childrenReal[index - childrenCountRemove],
                    prev = getPrevious(node),
                    useKey = prev && prev.useKey,
                    key = useKey ? prev.key : index;

                if (childrenVtagKeys[key]) {
                    childrenByKeys[key] = [node, useKey];
                } else {
                    recollectNodeTree(node);
                    remove(nextParent, node);
                    childrenCountRemove++;
                }
            }

            for (let i = 0; i < childrenVtagLength; i++) {
                let childVtag = childrenVtag[i],
                    childReal = childrenReal[i],
                    [childFromKey, useKey] =
                        childrenByKeys[
                            childVtag instanceof Vtag
                                ? childVtag.useKey
                                    ? childVtag.key
                                    : i
                                : i
                        ] || [];

                if (useKey && childFromKey !== childReal) {
                    before(nextParent, childFromKey, childReal);
                }

                updateElement(
                    nextParent,
                    childFromKey,
                    childReal,
                    childVtag,
                    context,
                    isSvg,
                    isCreate
                );
            }
        }
    } else {
        if (prev.children[0] !== next.children[0]) {
            base.textContent = next.children[0];
        }
    }

    base[PREVIOUS] = withUpdate ? next : prev;
    base[COMPONENTS] = components;
    emit(next, isCreate ? "onCreated" : "onUpdated", base);

    return base;
}
/**
 * Update or delete the attributes and events of a node
 * @param {HTMLElement} node - Node to assign changes
 * @param {Object} prev - Previous status of attributes
 * @param {Object} next - next status of attributes
 * @param {Boolean} [isSvg] - If it belongs to svg tree
 */
export function updateProperties(node, prev, next, isSvg) {
    let prevKeys = Object.keys(prev),
        nextKeys = Object.keys(next),
        keys = prevKeys.concat(nextKeys),
        length = keys.length,
        ignore = {};

    for (let i = 0; i < length; i++) {
        let prop = keys[i],
            inNext = prop in next,
            prevValue = prev[prop],
            nextValue = next[prop];

        if (ignore[prop] || prevValue === nextValue || IGNORE.test(prop))
            continue;

        ignore[prop] = true;

        if (prop === "class" && !isSvg) {
            prop = "className";
            nextValue = nextValue || "";
            prevValue = prevValue || "";
        }

        if ("scoped" === prop && "attachShadow" in node) {
            if (!node.shadowRoot)
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
                node.removeEventListener(prop, node[HANDLERS][prop][0]);
            }
            if (isFnNext) {
                if (!isFnPrev) {
                    node[HANDLERS] = node[HANDLERS] || {};
                    if (!node[HANDLERS][prop]) {
                        node[HANDLERS][prop] = [
                            event => {
                                node[HANDLERS][prop][1](event);
                            }
                        ];
                    }
                    node.addEventListener(prop, node[HANDLERS][prop][0]);
                }
                node[HANDLERS][prop][1] = nextValue;
            }
        } else if (inNext) {
            if (
                (prop in node &&
                    prop !== "list" &&
                    prop !== "type" &&
                    !isSvg) ||
                (isSvg && prop === "style")
            ) {
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
                    ? node.setAttributeNS(
                          isSvg && prop === "xlink"
                              ? "http://www.w3.org/1999/xlink"
                              : null,
                          prop === "xlink" ? "xlink:href" : prop,
                          nextValue
                      )
                    : node.setAttribute(prop, nextValue);
            }
        } else {
            node.removeAttribute(
                isSvg && prop === "xlink" ? "xlink:href" : prop
            );
        }
    }
}
/**
 * Issues the deletion of node and its children
 * @param {HTMLElement} node
 */
function recollectNodeTree(node) {
    let prev = getPrevious(node, false),
        components = getComponents(node),
        children = node.childNodes,
        length;

    if (!prev) return;

    node[REMOVE] = true;

    emit(prev, "onRemove", node);

    recollectComponentsEffects(components);

    length = children.length;

    for (let i = 0; i < length; i++) {
        recollectNodeTree(children[i]);
    }

    emit(prev, "onRemoved", node);
}

function recollectComponentsEffects(components) {
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
