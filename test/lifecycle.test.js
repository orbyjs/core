let { h, render } = require("../dist/orby");

describe("Lifecycle", () => {
    test("create", () => {
        render(
            <div
                oncreate={target => {
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
                oncreated={target => {
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
                onupdate={target => {
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
                onupdated={target => {
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
                    onremove={() => {
                        withUpdate = true;
                    }}
                    onremoved={() => {
                        expect(withUpdate).toBe(true);
                    }}
                />,
                document.body
            );

        render(<a />, document.body, fistRender);
    });
});
