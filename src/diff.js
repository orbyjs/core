import { Vtag } from "./vtag";
import { create, remove, append, replace, root, before } from "./dom";
import { options } from "./options";

import {
    COMPONENTS,
    PREVIOUS,
    REMOVE,
    HANDLERS,
    IGNORE,
    PREVIOUS_CSS_TEXT
} from "./constants";

import {
    Component,
    clearComponentEffects,
    getCurrentComponent
} from "./component";

let MEMO_PROPERTIES_CSS = {};
let MEMO_PROPERTIES_HANDLERS = {};
/**
 * It allows to print the status of virtual dom on the planned configuration
 * @param {Vtag} next - the next state of the node
 * @param {HTMLElement} parent - the container of the node
 * @param {HTMLElement} [child]  - the ancestor of the node
 * @param {object} [context] - the context of the node
 * @param {boolean} [isSvg] - check if the node belongs to a svg unit, to control it as such
 * @returns {HTMLElement} - The current node
 */
export function render(next, parent, child) {
    return updateElement(root(parent), child, false, next);
}
/**
 * allows to issue a property of the object
 * @param {Vtag} Vtag
 * @param {string} prop
 * @param  {...any} args
 * @returns {boolean|undefined}
 */
export function emit(Vtag, prop, ...args) {
    if (Vtag.removed) return;
    if (Vtag.remove && prop !== "onRemoved") return;
    if (prop === "onRemove") Vtag.remove = true;
    if (prop === "onRemoved") Vtag.removed = true;
    if (Vtag.props[prop]) return Vtag.props[prop](...args);
}
/**
 * obtains the previous state of the node, if it does not exist it creates an empty one
 * @param {HTMLElement|SVGElement|Text|undefined} node -node to extract the previous state by using the constate PREVIOUS
 * @param {boolean} create - being false this prevents the creation of an empty state
 * @returns {Vtag|boolean}
 */
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
/**
 * the components associated with the node return
 * @param {HTMLElement|SVGElement|undefined} node
 * @returns {Array|undefined}
 */
export function getComponents(node) {
    return node && node[COMPONENTS];
}
/**
 * allows to create, change or update
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
    components = []
) {
    let prev = getPrevious(node),
        base = node,
        component,
        withUpdate = true;

    components = getComponents(node) || components;
    //
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
    /**
     * being a component compares the index with the current node,
     * being different proceeds to its cleaning.
     * this happens with the removal of a node
     */
    if (components[deep] && components[deep].tag !== next.tag) {
        clearComponentEffects(components.splice(deep), true);
    }
    /**
     * if the current tag is a function, a state memorization is created as a component
     */
    if (typeof next.tag === "function") {
        if ((components[deep] || {}).tag !== next.tag) {
            components[deep] = new Component(next.tag, deep, components);
        }
        component = components[deep];
        next = next.clone(prev.tag || "");
    }
    if (prev.tag !== next.tag) {
        base = create(next.tag, isSvg);
        if (node) {
            if (!component && prev.tag) {
                recollectNodeTree(node, deep);
            }
            replace(parent, base, node);
        } else {
            /**
             *  if there is no Sibling, the use of insertNode is assumed, replacing appendChild.
             */
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
        component.isSvg = isSvg;
        component.base = base;
        component.parent = parent;
        component.props = next.props;
        component.context = context;

        if (component.prevent) {
            return component.base;
        }

        return component.update();
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
            if (
                (node.shadowRoot && !nextValue) ||
                (!node.shadowRoot && nextValue)
            ) {
                node.attachShadow({ mode: nextValue ? "open" : "closed" });
            }
            continue;
        }

        let isFnPrev = typeof prevValue === "function",
            isFnNext = typeof nextValue === "function";
        if (isFnPrev || isFnNext) {
            if (prop[0] !== "o" && props[1] !== "n") continue;
            if (!MEMO_PROPERTIES_HANDLERS[prop]) {
                MEMO_PROPERTIES_HANDLERS[prop] = prop.toLowerCase().slice(2);
            }
            prop = MEMO_PROPERTIES_HANDLERS[prop];
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
                    let prevCss = node[PREVIOUS_CSS_TEXT],
                        nextCss = nextValue;
                    if (typeof nextValue === "object") {
                        nextCss = "";
                        for (let prop in nextValue) {
                            if (nextValue) {
                                if (!MEMO_PROPERTIES_CSS[prop]) {
                                    MEMO_PROPERTIES_CSS[prop] = prop.replace(
                                        /([^A-Z])([A-Z])/g,
                                        (all, letterBefore, letterAfter) =>
                                            letterBefore +
                                            "-" +
                                            letterAfter.toLowerCase()
                                    );
                                }
                                nextCss += `${MEMO_PROPERTIES_CSS[prop]}:${
                                    nextValue[prop]
                                };`;
                            }
                        }
                    }
                    if (nextCss !== prevCss) {
                        node.style.cssText = nextCss;
                    }
                    node[PREVIOUS_CSS_TEXT] = nextCss;
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
 * @param {boolean} ignoreEffects - allows to ignore the collection of effects, this is ignored in case the component changes the root node
 */
function recollectNodeTree(node, ignoreEffects) {
    let prev = getPrevious(node, false),
        components = getComponents(node),
        children = node.childNodes,
        length;

    if (!prev) return;

    node[REMOVE] = true;

    emit(prev, "onRemove", node);

    if (!ignoreEffects) clearComponentEffects(components, true);

    length = children.length;

    for (let i = 0; i < length; i++) {
        recollectNodeTree(children[i]);
    }

    emit(prev, "onRemoved", node);
}
