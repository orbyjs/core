import { h, render, options } from "../dist/orby";
import { container } from "./util";

/**
 * by default the reading of the document can be associated with the option options.document,
 * this allows modifying the behavior of the create function in src/dom.js.
 *
 * the benefit of this is the possibility of server rendering or using a proxy like
 * api to manipulate other elements outside the sun, but keeping the same api DOM
 */
describe("diff with jsdom in options", () => {
    test("create tree of nodes", () => {
        options.document = document;

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
});
