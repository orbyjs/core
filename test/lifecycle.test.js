let { h, render } = require("../dist/orby");

describe("Lifecycle", () => {
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
});
