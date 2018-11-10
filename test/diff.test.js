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
});
