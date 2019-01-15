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
                use.update();
                use.prevent = false;
            }, options.delay);
            use.prevent = true;
        }
    ];
}

export function isDiffList(before, after) {
    let length = before.length;
    if (length !== after.length) return true;
    for (let i = 0; i < length; i++) {
        if (before[i] !== after[i]) return true;
    }
    return false;
}
/**
 * allows to add an observer effect before the changes of the component
 * note the use of `clearComponentEffects`, this function allows to clean the
 * effects associated with the elimination of the component.
 * @param {Function} handler
 * @param {array} args - allows to issue the handler only when one of the properties is different from the previous one
 */
export function useEffect(handler, args = []) {
    let setup,
        use = getCurrentComponent();
    args = [].concat(args);
    let [state] = useState(() => {
        setup = true;
        return { args };
    });

    if (!setup) {
        if (state.args.length && isDiffList(state.args, args)) {
            use.effects.prevent[use.effects.updated.length] = true;
        }
        state.args = args;
    }
    use.effects.updated.push(handler);
}

/**
 * generates a routing point by associating it with an instance stored in the current node
 * @param {Function} tag - function to associate with the component instance
 * @param {boolean} isSvg - define if the component belongs to a svg tree
 * @param {number} deep - depth index of components
 * @param {Array} currentComponents - group of components associated with the node
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
        /**
         * allows to render the current node
         */
        this.update = () => {
            //if (this.prevent) return this.base;
            if (this.base[REMOVE]) return;

            CURRENT_KEY_STATE = 0;
            CURRENT_COMPONENT = this;

            this.effects.updated = [];
            this.effects.prevent = {};

            let nextStateRender = tag(this.props, this.context);

            CURRENT_COMPONENT = false;

            this.clearEffects(true);

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

            this.recollectEffects();

            this.isCreate = false;

            return this.base;
        };
    }
    /**
     * cleans the effects associated with the component
     * @param {boolean} withPrevent - being true uses the effects.prevent property to skip execution
     *                                this option is given in a cleaning without elimination of the node
     */
    clearEffects(withPrevent) {
        let length = this.effects.remove.length;
        for (let i = 0; i < length; i++) {
            let remove = this.effects.remove[i];
            if (remove && (withPrevent ? !this.effects.prevent[i] : true))
                remove();
        }
    }
    /**
     * creates a new deletion effects queue, being true within effect.prevent,
     * the previous handler is retrieved
     */
    recollectEffects() {
        let remove = [],
            length = this.effects.updated.length;

        for (let i = 0; i < length; i++) {
            let handler = this.effects.updated[i];
            remove[i] = this.effects.prevent[i]
                ? this.effects.remove[i]
                : handler();
        }
        this.effects.remove = remove;
    }
}
