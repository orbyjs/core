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
});
