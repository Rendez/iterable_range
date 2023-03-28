type Item = number;

type RangeType = Iterable<Item> &
    Iterator<Item> & {
        len(): Item;
        clone(): RangeType;
        rev(): RangeType;
        step(item: Item): RangeType;
        empty(): boolean;
        contains(item: Item): boolean;
    };

function create(curr: Item, last: Item, rev?: boolean, step: Item = 1): RangeType {
    const update = rev ? (i: Item) => i - step : (i: Item) => i + step;
    const empty = rev ? () => curr < last : () => curr > last;
    const contains = rev ? (i: Item) => i <= curr && i >= last : (i: Item) => i >= curr && i <= last;
    let count = 0;

    return {
        [Symbol.iterator]() {
            return this;
        },
        next: () => {
            if (empty()) {
                return { value: count, done: true };
            }
            count += 1;
            const value = curr;
            curr = update(curr);
            return { value, done: false };
        },
        len: () => last - curr + 1,
        clone: () => create(curr, last, rev, step),
        rev: () => create(last, curr, true, step),
        step: (step: number) => create(curr, last, rev, step),
        contains,
        empty,
    };
}

function range(start = 0, end = Infinity, inclusive = false) {
    if (!inclusive) {
        end -= 1;
    }
    if (!(start > -1 && end > -1)) {
        throw new RangeError(`range(${start}, ${end}): invalid argument, must use finite positive numbers.`);
    }

    return create(start, end);
}

export { range as default, range };

if (import.meta.vitest) {
    // in-source test suites
    const { test, expect } = import.meta.vitest;

    test("invariant", () => {
        expect(() => range(0, 0)).toThrow(RangeError);
        expect(() => range(-1, 10)).toThrow("range(-1, 9)");
        expect(() => range(-1, 0)).toThrow("range(-1, -1)");
    });

    test("empty()", () => {
        expect(range(0, 0, true).empty()).toBe(false);
        expect(range(0, 1).empty()).toBe(false);
        expect(range(10, 5).empty()).toBe(true);
        expect(range(0, 1, true).empty()).toBe(false);
        expect(range(0, 0, true).rev().empty()).toBe(false);
        expect(range(0, 1).rev().empty()).toBe(false);
    });

    test("contains()", () => {
        expect(range(0, 5).contains(10)).toBe(false);
        expect(range(0, 5).contains(-5)).toBe(false);
        expect(range(10, 1).contains(5)).toBe(false);
        expect(range(10, 0, true).contains(5)).toBe(false);
        expect(range(0, 10).contains(0)).toBe(true);
        expect(range(0, 10).contains(5)).toBe(true);
        expect(range(0, 10).contains(10)).toBe(false);
        expect(range(0, 10, true).contains(10)).toBe(true);
        // rev
        expect(range(0, 10).rev().contains(5)).toBe(true);
        expect(range(0, 10).rev().contains(0)).toBe(true);
        expect(range(0, 10).rev().contains(10)).toBe(false);
        expect(range(0, 10, true).rev().contains(10)).toBe(true);
    });

    test("len()", () => {
        expect(range(0, 10).len()).toBe(10);
        const iter = range(1, 10, true);
        expect(iter.len()).toBe(10);
        for (const x of iter) {
            if (x === 5) {
                expect(iter.len()).toBe(5);
            }
        }
    });

    test("0..5", () => {
        const list = [];
        for (const x of range(0, 5)) {
            list.push(x);
        }
        expect(list).toStrictEqual([0, 1, 2, 3, 4]);
    });

    test("0..=5", () => {
        const list = [];
        for (const x of range(0, 5, true)) {
            list.push(x);
        }
        expect(list).toStrictEqual([0, 1, 2, 3, 4, 5]);
    });

    test("0..1", () => {
        const list = [];
        for (const x of range(0, 1)) {
            list.push(x);
        }
        expect(list).toStrictEqual([0]);
    });

    test("0..=0", () => {
        const list = [];
        for (const x of range(0, 1, true)) {
            list.push(x);
        }
        expect(list).toStrictEqual([0, 1]);
    });

    test("(1..=5).rev()", () => {
        const list = [];
        for (const x of range(1, 5, true).rev()) {
            list.push(x);
        }
        expect(list).toStrictEqual([5, 4, 3, 2, 1]);
    });

    test("clone()", () => {
        const original = range(0, 5);
        const clone = original.clone();

        const list = [];
        for (const x of original) {
            list.push(x);
        }
        for (const x of clone) {
            list.push(x);
        }
        expect(list).toStrictEqual([0, 1, 2, 3, 4, 0, 1, 2, 3, 4]);
    });

    test("step()", () => {
        const list = [];
        for (const x of range(1, 10).step(2)) {
            list.push(x);
        }
        expect(list).toStrictEqual([1, 3, 5, 7, 9]);
    });

    test("iterator", () => {
        const iter = range(0, 5);
        const list = [];
        let result = iter.next();
        while (!result.done) {
            list.push(result.value);
            result = iter.next();
        }
        expect(result.value).toBe(5);
        expect(list).toStrictEqual([0, 1, 2, 3, 4]);
    });
}
