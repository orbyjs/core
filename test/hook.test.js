import {
    h,
    render,
    useState,
    useEffect,
    useReducer,
    useMemo
} from "../dist/orby";
import { container } from "./util";

describe("test hooks", () => {
    test("useState && updated", () => {
        let scope = container();
        function Tag() {
            let [count, setCount] = useState(0);
            return (
                <div
                    onCreate={() => setCount(count + 1)}
                    onUpdated={() => {
                        expect(count).toBe(1);
                    }}
                />
            );
        }
        render(<Tag />, scope);
    });
    test("useState && updated", () => {
        let scope = container();
        function Tag() {
            let [count1, setCount1] = useState(1);
            let [count2, setCount2] = useState(10);
            let [count3, setCount3] = useState(20);
            return (
                <div
                    onCreate={() => {
                        setCount1(count1 + 1);
                        setCount2(count2 + 1);
                        setCount3(count3 + 1);
                    }}
                    onUpdated={() => {
                        expect({ count1, count2, count3 }).toEqual({
                            count1: 2,
                            count2: 11,
                            count3: 21
                        });
                    }}
                />
            );
        }
        render(<Tag />, scope);
    });

    test("useEffect", () => {
        let scope = container();
        function Tag() {
            useEffect(() => {
                expect(scope.querySelector("#tag").outerHTML).toBe(
                    `<div id="tag"></div>`
                );
            });
            return <div id="tag" />;
        }
        render(<Tag />, scope);
    });

    test("useEffect with remove", done => {
        let scope = container();
        function Tag() {
            useEffect(() => {
                return () => {
                    setTimeout(() => {
                        expect(scope.querySelector("#tag")).toBe(null);
                        done();
                    });
                };
            });
            return <div id="tag" />;
        }
        let fistRender = render(<Tag />, scope);

        render(<div />, scope, fistRender);
    });
});

describe("customHooks", () => {
    test("useReducer", done => {
        let scope = container();
        let prefixCase = "prefix-",
            initialAction = {
                type: "DEFAULT",
                payload: "fist-message"
            },
            secondAction = {
                type: "UPDATE",
                payload: "second-message"
            };

        function reducer(state, action) {
            switch (action.type) {
                case "UPDATE":
                    return { message: prefixCase + action.payload };
                default:
                    return { message: action.payload };
            }
        }

        function Test() {
            let [state, dispatch] = useReducer(reducer, initialAction);
            return (
                <div
                    onCreated={target => {
                        expect(target.textContent).toBe(initialAction.payload);
                        dispatch(secondAction);
                    }}
                    onUpdated={target => {
                        expect(target.textContent).toBe(
                            prefixCase + secondAction.payload
                        );
                        done();
                    }}
                >
                    {state.message}
                </div>
            );
        }

        render(<Test />, scope);
    });

    test("useMemo basic", done => {
        let scope = container();

        function Test() {
            let [state, setState] = useState();
            let countCall = 0;
            let list = useMemo(() => {
                let list = [];
                countCall++;
                for (let i = 0; i < 100; i++) {
                    list.push(i);
                }
                return list;
            }, 100);

            return (
                <div
                    onCreated={() => {
                        setState();
                    }}
                    onUpdated={target => {
                        expect(list.length).toBe(100);
                        done();
                    }}
                >
                    {list.map(() => (
                        <button />
                    ))}
                </div>
            );
        }

        render(<Test />, scope);
    });
});
