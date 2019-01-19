import { isArray, isEqualArray } from "./utils";
import { options } from "./options";
import { updateElement } from "./diff";
import { REMOVE } from "./constants";

let CURRENT_COMPONENT;
let CURRENT_KEY_STATE;

export function clearComponentEffects(components) {
    let length = components.length;
    for (let i = 0; i < length; i++) {
        components[i].clearEffects(false);
    }
}

/**
 * obtains the component in execution, for the connection with the hooks
 * @returns {Vtag}
 */
export function getCurrentComponent() {
    if (CURRENT_COMPONENT) {
        return CURRENT_COMPONENT;
    }
    throw new Error(
        "the hooks can only be called from an existing functional component in the diff queue"
    );
}
/**
 * Allows you to add an observer status of changes to the functional component
 * @param {*} initialState - Initial state to register
 */
export function useState(initialState) {
    let key = CURRENT_KEY_STATE++,
        use = getCurrentComponent();

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
            setTimeout(() => {
                use.update(true);
                use.prevent = false;
            }, options.delay);
            use.prevent = true;
        }
    ];
}

/**
 * allows to add an observer effect before the changes of the component
 * note the use of `clearComponentEffects`, this function allows to clean the
 * effects associated with the elimination of the component.
 * @param {Function} handler
 * @param {array} args - allows to issue the handler only when one of the properties is different from the previous one
 */
export function useEffect(handler, args) {
    let setup,
        use = getCurrentComponent(),
        isValidArgs = isArray(args);

    let [state] = useState(() => {
        setup = true;
        return { args: isValidArgs ? args : [] };
    });

    if (!setup) {
        if (isValidArgs) {
            if (isEqualArray(state.args, args)) {
                use.effectsToPrevent[use.effectsToUpdated.length] = true;
            }
            state.args = args;
        }
    }
    use.effectsToUpdated.push(handler);
}

/**
 * generates a routing point by associating it with an instance stored in the current node
 * @class
 * @param {Function} tag - function to associate with the component instance
 * @param {number} deep - depth index of components
 * @param {Array} components - group of components associated with the node
 * @property {HTMLElement} parent - parentElement where the node to be updated is hosted by the component
 * @property {HTMLElement} base - node already hosted within the parentElement, to update or replace
 * @property {boolean} isSvg - if true, the component will create svg nodes
 * @property {boolean} deep - depth level of the component, in the high order list.
 * @property {boolean} boot - Bootstrap, defines if the component is instantiated, to force executions
 * @property {Array} components - List of components in high order
 * @property {object} props - component properties
 * @property {states} states - state store for useState
 * @property {Array} effectsToRemove - Efectos a limpiar antes de cada render o eliminación.
 * @property {Array} effectsToUpdated - Effects to call after each render
 * @property {Object} effectsToPrevent - effects to prevent execution, either by comparison of parameters
 * @property {Object} context - inherited context to the component
 * @property {boolean} prevent - the microtask, blocks the execution of render based on options.delay,
 *                               prevent allows to respect this blocking
 */
export class Component {
    constructor(tag, deep, components) {
        this.parent;
        this.base;
        this.isSvg;
        this.deep = deep;
        this.boot = true;
        this.components = components;
        this.tag = tag;
        this.props = {};
        this.states = [];
        this.effectsToRemove = [];
        this.effectsToUpdated = [];
        this.effectsToPrevent = {};
        this.context = {};
        this.prevent = false;
    }
    /**
     * cleans the effects associated with the component
     * @param {boolean} withPrevent - being true uses the effectsToPrevent property to skip execution
     *                                this option is given in a cleaning without elimination of the node
     */
    clearEffects(withPrevent) {
        let length = this.effectsToRemove.length;
        for (let i = 0; i < length; i++) {
            let remove = this.effectsToRemove[i];
            if (remove && (withPrevent ? !this.effectsToPrevent[i] : true))
                remove();
        }
    }
    /**
     * creates a new deletion effects queue, being true within effectsToPrevent,
     * the previous handler is retrieved
     */
    recollectEffects() {
        let remove = [],
            length = this.effectsToUpdated.length;

        for (let i = 0; i < length; i++) {
            let handler = this.effectsToUpdated[i];
            remove[i] = this.effectsToPrevent[i]
                ? this.effectsToRemove[i]
                : handler();
        }
        this.effectsToRemove = remove;
    }
    update() {
        //if (this.prevent) return this.base;
        if (this.base[REMOVE]) return;

        CURRENT_KEY_STATE = 0;
        CURRENT_COMPONENT = this;

        this.effectsToUpdated = [];
        this.effectsToPrevent = {};

        let nextState = this.tag(this.props, this.context);

        CURRENT_COMPONENT = false;

        this.clearEffects(true);

        let base = updateElement(
            this.parent,
            this.base,
            false,
            nextState,
            this.context,
            this.isSvg,
            this.boot,
            this.deep + 1,
            this.components
        );
        /**
         * updates the parents of the presence of the new node
         */
        if (base !== this.base) {
            for (let i = 0; i < this.deep; i++) {
                this.components[i].base = base;
            }
        }
        this.base = base;
        this.recollectEffects();
        this.boot = false;
        return this.base;
    }
}
