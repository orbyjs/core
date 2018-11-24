export class VDom {
    /**
     *
     * @param {Function|String} tag - Node component or label
     * @param {Object} props - Properties of the label
     * @param {Array} children - Children assigned to the node
     */
    constructor(tag, props = {}, children = []) {
        this.tag = tag;
        this.props = {
            ...props,
            children
        };
    }
    /**
     * Clone the current node by keeping props and children by default
     * @param {Function|String} tag -  Node component or label
     * @param {*} props - Properties of the label
     * @param {*} children - Children assigned to the node
     */
    clone(tag = this.tag, props = this.props, children = this.props.children) {
        return new VDom(tag, props, children);
    }
    /**
     * Dispatch an existing function in `this.props`
     * @param {String} prop - Property to emit the virtual node only if it exists as a function
     * @param  {...any} args - Arguments to be issued to the function
     */
    emit(prop, ...args) {
        if (this.prevent) return;
        if (prop === "remove") this.prevent = true;
        if (typeof this.props[prop] === "function") this.props[prop](...args);
    }
}
/**
 * Prepare the virtual node
 * @param {Function|String} tag
 * @param {Object} props
 * @param  {...any} children
 * @return {VDom}
 */
export function h(tag, props, ...children) {
    return new VDom(tag || "", props, concat(children));
}
/**
 * Clean existing values in virtual-dom tree
 * @param {*} children
 * @param {*} merge
 */
export function concat(children, next = []) {
    for (let i = 0; i < children.length; i++) {
        let value = children[i];
        Array.isArray(value) ? concat(value, next) : next.push(value);
    }
    return next;
}
