let { h, render } = require("../dist/orby");

describe("Lifecycle", () => {
    test("create", () => {
        render(
            <div
                onCreate={target => {
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
                onCreated={target => {
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
                onUpdate={target => {
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
                onUpdated={target => {
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
                    onRemove={() => {
                        withUpdate = true;
                    }}
                    onRemoved={() => {
                        expect(withUpdate).toBe(true);
                    }}
                />,
                document.body
            );

        render(<a />, document.body, fistRender);
    });
});
