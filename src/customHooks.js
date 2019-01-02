import { useState } from "./diff";

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
