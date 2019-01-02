import { h, render, useState, useEffect, useReducer } from "../dist/orby";

describe("test hooks", () => {
    test("useState && updated", () => {
        function Tag() {
            let [count, setCount] = useState(0);
            return (
                <div
                    create={() => setCount(count + 1)}
                    updated={() => {
                        expect(count).toBe(1);
                    }}
                />
            );
        }
        render(<Tag />, document.body);
    });
    test("useState && updated", () => {
        function Tag() {
            let [count1, setCount1] = useState(1);
            let [count2, setCount2] = useState(10);
            let [count3, setCount3] = useState(20);
            return (
                <div
                    create={() => {
                        setCount1(count1 + 1);
                        setCount2(count2 + 1);
                        setCount3(count3 + 1);
                    }}
                    updated={() => {
                        expect({ count1, count2, count3 }).toEqual({
                            count1: 2,
                            count2: 11,
                            count3: 21
                        });
                    }}
                />
            );
        }
        render(<Tag />, document.body);
    });

    test("useEffect", () => {
        function Tag() {
            useEffect(() => {
                expect(document.querySelector("#tag").outerHTML).toBe(
                    `<div id="tag"></div>`
                );
            });
            return <div id="tag" />;
        }
        render(<Tag />, document.body);
    });

    test("useEffect with remove", () => {
        function Tag() {
            useEffect(() => {
                return () => {
                    setTimeout(() => {
                        expect(document.querySelector("#tag")).toBe(null);
                    });
                };
            });
            return <div id="tag" />;
        }
        let fistRender = render(<Tag />, document.body);

        render(<div />, document.body, fistRender);
    });
});

describe("customHooks", () => {
    test("useReducer", done => {
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

        render(<Test />, document.body);
    });
});
