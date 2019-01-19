import { h, render } from "../dist/orby";
import { container, createList, randomList, randomInsert } from "./util";

describe("test keys", () => {
    test("keys reverse", () => {
        let scope = container();
        let state = createList();

        let nextState = createList().reverse();

        let fistRender = render(
            <div>
                {state.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            scope
        );

        let fistIds = Array.from(fistRender.querySelectorAll("[id]"));

        let secondRender = render(
            <div>
                {nextState.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            scope,
            fistRender
        );

        let secondIds = Array.from(secondRender.querySelectorAll("[id]"));

        expect(
            secondIds.every((node, index) => node.id === nextState[index].key)
        ).toBeTruthy();

        secondIds.reverse();

        expect(secondIds.every((node, index) => node === fistIds[index])).toBe(
            true
        );
    });

    test("keys random", () => {
        let scope = container();
        let state = createList();

        let nextState = randomList(createList());

        let fistRender = render(
            <div>
                {state.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            scope
        );

        let fistIds = Array.from(fistRender.querySelectorAll("[id]"));

        let secondRender = render(
            <div>
                {nextState.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            scope,
            fistRender
        );

        let secondIds = Array.from(secondRender.querySelectorAll("[id]"));

        expect(
            secondIds.every((node, index) => node.id === nextState[index].key)
        ).toBeTruthy();

        expect(
            secondIds
                .sort((a, b) => (a.id > b.id ? 1 : -1))
                .every((node, index) => node === fistIds[index])
        ).toBeTruthy();
    });

    test("keys with insert", () => {
        let scope = container();
        let state = createList();

        let nextState = randomInsert(randomList(createList()));

        let fistRender = render(
            <div>
                {state.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            scope
        );

        let fistIds = Array.from(fistRender.querySelectorAll("[id]"));

        let secondRender = render(
            <div>
                {nextState.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            scope,
            fistRender
        );

        let secondIds = Array.from(secondRender.querySelectorAll("[id]"));

        expect(
            secondIds.every((node, index) => node.id === nextState[index].key)
        ).toBeTruthy();
    });
});
