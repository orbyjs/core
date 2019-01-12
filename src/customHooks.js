import { useState, getCurrentComponent } from "./component";

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
