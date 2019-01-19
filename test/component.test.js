import { h, render, useState, useEffect, options } from "../dist/orby";
import { container } from "./util";

describe("test components", () => {
    test("single component", () => {
        let scope = container();
        function Test() {
            return <h1>component</h1>;
        }

        render(<Test />, scope);
        expect(scope.innerHTML).toBe("<h1>component</h1>");
    });
    test("higth order", () => {
        let scope = container();
        function Tree() {
            return <h1>component</h1>;
        }
        function Two() {
            return <Tree />;
        }
        function One() {
            return <Two />;
        }

        render(<One />, scope);
        expect(scope.innerHTML).toBe("<h1>component</h1>");
    });

    test("higth order with remove tree", done => {
        let scope = container(),
            isRemove = false;
        function Tree() {
            return (
                <h1
                    onRemove={() => {
                        isRemove = true;
                    }}
                >
                    component
                </h1>
            );
        }
        function Two() {
            let [hidden, setHidden] = useState();
            useEffect(() => {
                setHidden(true);
            });
            return hidden ? "" : <Tree />;
        }
        function One() {
            return <Two />;
        }

        let lastRender = render(<One />, scope);

        render(<One />, scope, lastRender);
        setTimeout(() => {
            expect(scope.innerHTML).toBe("");
            expect(isRemove).toBeTruthy();
            done();
        }, options.delay);
    });
});
