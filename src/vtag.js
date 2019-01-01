export class Vtag {
    /**
     *
     * @param {Function|String} tag - Node component or label
     * @param {Object} props - Properties of the label
     * @param {Array} children - Children assigned to the node
     */
    constructor(tag, props = {}, children = []) {
        this.tag = tag;
        this.keys = [];
        this.children = [];
        this.props = {
            ...props,
            children: this.children
        };
        this.key = this.props.key;
        this.ref = this.props.ref;
        this.useKey = this.props.key !== undefined;

        this.loadChildren(children);
    }
    /**
     * Clone the current node by keeping props and children by default
     * @param {Function|String} tag -  Node component or label
     * @param {*} props - Properties of the label
     * @param {*} children - Children assigned to the node
     */
    clone(tag = this.tag, props = this.props, children = this.props.children) {
        return new Vtag(tag, props, children);
    }
    loadChildren(children) {
        let length = children.length;
        for (let i = 0; i < length; i++) {
            let value = children[i];
            if (Array.isArray(value)) {
                this.loadChildren(value);
            } else {
                this.keys.push(
                    value instanceof Vtag
                        ? value.key !== undefined
                            ? value.key
                            : this.keys.length
                        : this.keys.length
                );
                this.children.push(value);
            }
        }
    }
}
/**
 * Prepare the virtual node
 * @param {Function|String} tag
 * @param {Object} props
 * @param  {...any} children
 * @return {Vtag}
 */
export function h(tag, props, ...children) {
    return new Vtag(tag || "", props, children);
}
