import { useState, getCurrentComponent } from "./component";
import { isArray, isEqualArray } from "./utils";

export function useReducer(reducer, firstAction = { type: "setup" }) {
    let [state, setState] = useState(() => ({
        current: reducer(undefined, firstAction)
    }));
    return [
        state.current,
        action => {
            state.current = reducer(state.current, action);
            setState(state);
        }
    ];
}

/**
 * returns the current context of the component in execution
 * @param {string} [space]
 */
export function useContext(space) {
    let context = getCurrentComponent().context;
    return space ? context[space] : context;
}

export function useMemo(callback, args) {
    let [state] = useState({ args: [] }),
        isValidArgs = isArray(args);

    if (isValidArgs && !isEqualArray(state.args, args)) {
        state.memo = callback();
        state.args = args;
    }

    return state.memo;
}

export function useRef(current) {
    let [state] = useState({ current });
    return state;
}
