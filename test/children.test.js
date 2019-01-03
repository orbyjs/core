import { h, render, useState } from "../dist/orby";

describe("children", () => {
    test("hidden children", done => {
        function Test() {
            let [state, setState] = useState();
            return (
                <div
                    onCreated={target => {
                        expect(target.children.length).toBe(0);
                        setState(true);
                    }}
                    onUpdated={target => {
                        expect(target.children.length).toBe(4);
                        done();
                    }}
                >
                    {state ? <button /> : undefined}
                    {state ? <button /> : undefined}
                    {state ? <button /> : undefined}
                    {state ? <button /> : undefined}
                </div>
            );
        }

        render(<Test />, document.body);
    });
    test("remove children", done => {
        function Test() {
            let [state, setState] = useState(() => {
                let list = [];
                for (let key = 0; key < 100; key++) {
                    list.push({ key });
                }
                return list;
            });
            return (
                <div
                    onCreated={target => {
                        expect(target.children.length).toBe(100);
                        setState([]);
                    }}
                    onUpdated={target => {
                        expect(target.children.length).toBe(0);
                        done();
                    }}
                >
                    {state.map(() => (
                        <button />
                    ))}
                </div>
            );
        }

        render(<Test />, document.body);
    });
});
