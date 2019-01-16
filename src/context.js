import { h } from "./vtag";
import { CONTEXT } from "./constants";

let counter = 0;
/**
 * create a consumable context by useContext,
 * using counter the context name is
 * incremental insuring a namespace for each
 * invocation of createContext
 * @param {*} valueDefault
 */
export function createContext(valueDefault) {
    let space = CONTEXT + counter++,
        Context = ({ children }) => children[0];
    return {
        /**
         * usState obtains the context through the use of space
         * `useState(Context)`
         */
        toString() {
            return space;
        },
        /**
         * adds to the diff process the new context
         * @param {*} props
         */
        Provider(props) {
            return (
                <Context context={{ [space]: props.value || valueDefault }}>
                    {props.children}
                </Context>
            );
        },
        /**
         * obtains from the current context the value associated with the instance
         * @param {object} props
         * @param {object} context
         */
        Consumer(props, context) {
            return props.children[0](context[space]);
        }
    };
}
