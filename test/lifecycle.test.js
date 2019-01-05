import { h, render } from "../dist/orby";
import { container } from "./util";
describe("Lifecycle", () => {
    test("create", () => {
        let scope = container();
        render(
            <div
                onCreate={target => {
                    expect(target.outerHTML).toBe("<div></div>");
                }}
            >
                my-div
            </div>,
            scope
        );
    });
    test("created", () => {
        let scope = container();
        render(
            <div
                onCreated={target => {
                    expect(target.outerHTML).toBe("<div>my-div</div>");
                }}
            >
                my-div
            </div>,
            scope
        );
    });
    test("update", () => {
        let scope = container();
        let fistRender = render(<div />, scope);

        render(
            <div
                onUpdate={target => {
                    expect(target.outerHTML).toBe("<div></div>");
                }}
            >
                my-div
            </div>,
            scope,
            fistRender
        );
    });
    test("updated", () => {
        let scope = container();
        let fistRender = render(<div />, scope);

        render(
            <div
                onUpdated={target => {
                    expect(target.outerHTML).toBe("<div>my-div</div>");
                }}
            >
                my-div
            </div>,
            scope,
            fistRender
        );
    });
    test("remove && removed", () => {
        let scope = container();
        let withUpdate,
            fistRender = render(
                <div
                    onRemove={() => {
                        withUpdate = true;
                    }}
                    onRemoved={() => {
                        expect(withUpdate).toBe(true);
                    }}
                />,
                scope
            );

        render(<a />, scope, fistRender);
    });
});
