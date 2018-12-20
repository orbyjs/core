let { h, render } = require("../dist/orby");

describe("diff", () => {
    test("create tree of nodes", () => {
        let label = "text";
        render(
            <div id="parent">
                <div id="child">
                    <button>{label}</button>
                </div>
            </div>,
            document.body
        );

        expect(
            document.body.querySelector("#parent #child button").textContent
        ).toBe(label);
    });

    test("create component", () => {
        let label = "text";

        function Button(props) {
            return <button id="button">{props.label}</button>;
        }

        render(<Button label={label} />, document.body);

        expect(document.body.querySelector("#button").textContent).toBe(label);
    });

    test("context static", () => {
        let id = 100;

        function Child(props, context) {
            expect(context.id).toBe(id);
        }

        function Parent(props, context) {
            return (
                <div>
                    <Child />
                </div>
            );
        }

        render(
            <div context={{ id }}>
                <Parent />
            </div>,
            document.body
        );
    });
    test("context dinamic", () => {
        let id = 100,
            cd = 200;

        function Child(props, context) {
            expect(context).toEqual({ id, cd });
        }

        function Parent(props, context) {
            return (
                <div context={{ cd }}>
                    <Child />
                </div>
            );
        }

        render(
            <div context={{ id }}>
                <Parent />
            </div>,
            document.body
        );
    });
    test("create", () => {
        render(
            <div
                create={target => {
                    expect(target.outerHTML).toBe("<div></div>");
                }}
            >
                my-div
            </div>,
            document.body
        );
    });
    test("created", () => {
        render(
            <div
                created={target => {
                    expect(target.outerHTML).toBe("<div>my-div</div>");
                }}
            >
                my-div
            </div>,
            document.body
        );
    });
    test("update", () => {
        let fistRender = render(<div />, document.body);

        render(
            <div
                update={target => {
                    expect(target.outerHTML).toBe("<div></div>");
                }}
            >
                my-div
            </div>,
            document.body,
            fistRender
        );
    });
    test("updated", () => {
        let fistRender = render(<div />, document.body);

        render(
            <div
                updated={target => {
                    expect(target.outerHTML).toBe("<div>my-div</div>");
                }}
            >
                my-div
            </div>,
            document.body,
            fistRender
        );
    });
    test("remove && removed", () => {
        let withUpdate,
            fistRender = render(
                <div
                    remove={() => {
                        withUpdate = true;
                    }}
                    removed={() => {
                        expect(withUpdate).toBe(true);
                    }}
                />,
                document.body
            );

        render(<a />, document.body, fistRender);
    });

    test("keys", () => {
        let state = [
            { key: 1, value: "1" },
            { key: 2, value: "2" },
            { key: 3, value: "3" },
            { key: 4, value: "4" },
            { key: 5, value: "5" }
        ];

        let fistRender = render(
            <div>
                {state.map(({ key, value }) => (
                    <button key={key} id={`id-${key}`}>
                        {value}
                    </button>
                ))}
            </div>,
            document.body
        );
        // Get the current button list
        let beforeButtons = Array.from(fistRender.querySelectorAll("button"));
        // inverts the state, to generate a new one with the new order.
        state.reverse();
        // Get the current button list, after the new order.
        let secondRender = render(
            <div>
                {state.map(({ key, value }) => (
                    <button key={key} id={`id-${key}`}>
                        {value}
                    </button>
                ))}
            </div>,
            document.body,
            fistRender
        );

        let afterButtons = Array.from(
            secondRender.querySelectorAll("button")
        ).reverse();

        expect(
            // compares the current order with the previous one,
            // verifying that the nodes are the same
            afterButtons.every(
                (currentNode, index) => currentNode === beforeButtons[index]
            )
        ).toBe(true);
    });
});
