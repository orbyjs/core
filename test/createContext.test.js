import { h, createContext, render } from "../dist/orby";
import { container } from "./util";

describe("context", () => {
    test("define context", done => {
        let scope = container();
        let state = { name: "default" };
        let Context = createContext(state);

        render(
            <Context.Provider>
                <div>
                    <div>
                        <Context.Consumer>
                            {data => (
                                <h1
                                    onCreated={target => {
                                        expect(target.textContent).toBe(
                                            state.name
                                        );
                                        done();
                                    }}
                                >
                                    {data.name}
                                </h1>
                            )}
                        </Context.Consumer>
                    </div>
                </div>
            </Context.Provider>,
            scope
        );
    });
});
