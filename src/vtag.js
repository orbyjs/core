import { isArray } from "./utils";
/**
 * @property {Function|string} tag - being string will create a node, since it is a
 *                               function that will isolate its execution as a component
 * @property {object} keys - to avoid the index map within the diff process the vtag will
 *                           generate one based on the required method that joins the children in a single list
 * @property {array} children - list of nodes associated with the vtag
 * @property {object} props - vtag properties
 * @property {key} key - index of the vtag
 * @property {boolean} static - define if the node is static for updateElement
 * @property {boolean} useKey - If you have a key definition, this property is defined as true
 * @property {number} keysLength - number of children associated with the vtag
 */
export class Vtag {
    /**
     * @param {Function|String} tag - Node component or label
     * @param {Object} props - Properties of the label
     * @param {Array} children - Children assigned to the node
     */
    constructor(tag, props = {}, children = []) {
        props = props === null ? {} : props;
        this.tag = tag;
        this.keys = {};
        this.children = [];
        this.props = {
            ...props,
            children: this.children
        };
        this.key = props.key;
        this.ref = props.ref;
        this.static = props.static;
        this.useKey = props.key !== undefined;
        this.keysLength = 0;
        this.mapChildren(isArray(props.children) ? props.children : children);
    }
    /**
     * Clone the current node by keeping props and children by default
     * @param {Function|String} tag -  Node component or label
     * @param {*} props - Properties of the label
     * @param {*} children - Children assigned to the node
     * @return {Vtag}
     */
    clone(tag = this.tag, props = this.props, children = this.props.children) {
        return new Vtag(tag, props, children);
    }
    /**
     * list the children to attach them to children
     * @param {Array} children
     */
    mapChildren(children) {
        let length = children.length;
        for (let i = 0; i < length; i++) {
            let value = children[i];
            if (isArray(value)) {
                this.mapChildren(value);
            } else {
                let key =
                    value instanceof Vtag && value.useKey
                        ? value.key
                        : this.keysLength;
                if (this.keys[key]) {
                    throw new Error("Each key must be unique among children");
                } else {
                    this.keys[key] = true;
                    this.children.push(value);
                    this.keysLength++;
                }
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
