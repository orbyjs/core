import { h, render } from "../dist/orby";
import { container } from "./util";

describe("diff", () => {
    test("create tree of nodes", () => {
        let scope = container();
        let label = "text";
        render(
            <div id="parent">
                <div id="child">
                    <button>{label}</button>
                </div>
            </div>,
            scope
        );

        expect(scope.querySelector("#parent #child button").textContent).toBe(
            label
        );
    });

    test("create tree of nodes", () => {
        let scope = container();
        let label = "text";
        render(
            <div class="parent">
                <div class="child">
                    <button>{label}</button>
                </div>
            </div>,
            scope
        );

        expect(scope.querySelector(".parent .child button").textContent).toBe(
            label
        );
    });

    test("create component", () => {
        let scope = container();
        let label = "text";

        function Button(props) {
            return <button id="button">{props.label}</button>;
        }

        render(<Button label={label} />, scope);

        expect(scope.querySelector("#button").textContent).toBe(label);
    });

    test("context static", () => {
        let scope = container();
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
            scope
        );
    });
    test("context dinamic", () => {
        let scope = container();
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
            scope
        );
    });
});
