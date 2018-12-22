let { h, render } = require("../dist/orby");

function createList(length = 10) {
    let list = [];
    for (let key = 0; key < length; key++) {
        list.push({ key: String(key) });
    }
    return list;
}

function randomList(list) {
    var currentIndex = list.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = list[currentIndex];
        list[currentIndex] = list[randomIndex];
        list[randomIndex] = temporaryValue;
    }

    return list;
}

function randomInsert(list, length = 100) {
    for (let i = 0; i < length; i++) {
        let insertIn = Math.floor(Math.random() * list.length);

        let before = list.slice(0, insertIn),
            after = list.slice(insertIn),
            key = insertIn + "." + i;

        list = before.concat({ key }, after);
    }
    return list;
}

describe("test keys", () => {
    test("keys reverse", () => {
        let state = createList();

        let nextState = createList().reverse();

        let fistRender = render(
            <div>
                {state.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            document.body
        );

        let fistIds = Array.from(fistRender.querySelectorAll("[id]"));

        let secondRender = render(
            <div>
                {nextState.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            document.body,
            fistRender
        );

        let secondIds = Array.from(secondRender.querySelectorAll("[id]"));

        expect(
            secondIds.every((node, index) => node.id === nextState[index].key)
        ).toBe(true);

        secondIds.reverse();

        expect(secondIds.every((node, index) => node === fistIds[index])).toBe(
            true
        );
    });

    test("keys random", () => {
        let state = createList();

        let nextState = randomList(createList());

        let fistRender = render(
            <div>
                {state.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            document.body
        );

        let fistIds = Array.from(fistRender.querySelectorAll("[id]"));

        let secondRender = render(
            <div>
                {nextState.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            document.body,
            fistRender
        );

        let secondIds = Array.from(secondRender.querySelectorAll("[id]"));

        expect(
            secondIds.every((node, index) => node.id === nextState[index].key)
        ).toBe(true);

        expect(
            secondIds
                .sort((a, b) => (a.id > b.id ? 1 : -1))
                .every((node, index) => node === fistIds[index])
        ).toBe(true);
    });

    test("keys with insert", () => {
        let state = createList();

        let nextState = randomInsert(randomList(createList()));

        let fistRender = render(
            <div>
                {state.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            document.body
        );

        let fistIds = Array.from(fistRender.querySelectorAll("[id]"));

        let secondRender = render(
            <div>
                {nextState.map(({ key }) => (
                    <div id={key} key={key} />
                ))}
            </div>,
            document.body,
            fistRender
        );

        let secondIds = Array.from(secondRender.querySelectorAll("[id]"));

        expect(
            secondIds.every((node, index) => node.id === nextState[index].key)
        ).toBe(true);
    });
});
