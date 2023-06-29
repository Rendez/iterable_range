# Iterable Range

Typescript iterator/iterable range based on Rust's [`std::ops::Range`](https://doc.rust-lang.org/std/ops/struct.Range.html).

The range start..end contains all values with start <= x < end. It is empty if start >= end.

## Usage

### As Iterator

```js
const list = [];
const iter = range(0, 5);
let result = iter.next();
while (!result.done) {
    list.push(result.value);
    result = iter.next();
}
console.log(result.value); // 5;
console.log(list); // [0, 1, 2, 3, 4]
```

### As Iterable

```js
const list = [];
for (const x of range(0, 5)) {
    list.push(x);
}
console.log(list); // [0, 1, 2, 3, 4]
```

### Inclusive

```js
const list = [];
for (const x of range(0, 5, true)) {
    list.push(x);
}
console.log(list); // [0, 1, 2, 3, 4, 5]
```

## API

### Iterable Helpers

There is a proposal, that brings multiple [helper functions to Iterator](https://github.com/tc39/proposal-iterator-helpers)

You can use it today by utilizing core-js-pure:

```js
import { from as iterFrom } from "core-js-pure/features/iterator";

// or if it's working for you (it should work according to the docs,
// but hasn't for me for some reason):
// import iterFrom from "core-js-pure/features/iterator/from";

let m = new Map();

m.set("13", 37);
m.set("42", 42);

const arr = iterFrom(m.values())
  .map((val) => val * 2)
  .toArray();

// prints "[74, 84]"
console.log(arr);
```
The good part is that is being rapidly adopted by the main vendors, [Chrome intends to ship them on version 117](https://chromestatus.com/feature/5102502917177344) and there's strong support for Firefox and Safari, which means soon this will be widespread.

### Iterator build-ins

#### rev()

Reverses an iterator’s direction.

```js
const list = [];
for (const x of range(0, 5).rev()) {
    list.push(x);
}
console.log(list); // [4, 3, 2, 1, 0]
```

#### step()

Creates an iterator starting at the same point, but stepping by the given amount at each iteration.

```js
const list = [];
for (const x of range(0, 5).step(2)) {
    list.push(x);
}
console.log(list); // [0, 2, 4]
```

#### clone()

Creates an iterator which clones all of its elements.

```js
const original = range(0, 5);
const clone = original.clone();

const list = [];
for (const x of original) {
    list.push(x);
}
for (const x of clone) {
    list.push(x);
}
console.log(list); // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
```

#### len()

Returns the exact remaining length of the iterator.

```js
const iter = range(1, 10, true);
console.log(iter.len()); // 10
for (const x of iter) {
    if (x === 5) {
        console.log(iter.len()); // 5
    }
}
```

#### contains()

Returns `true` if item is contained in the range.

```js
console.log(range(0, 5).contains(10)); // false
console.log(range(0, 5).contains(-5)); // false
console.log(range(0, 10).contains(0)); // true
console.log(range(0, 10).contains(5)); // true
console.log(range(0, 10, true).contains(10)); // true
```

#### empty()

Returns `true` if the range contains no items.

```js
console.log(range(0, 0, true).empty()); // false
console.log(range(0, 1).empty()); // false
console.log(range(10, 5).empty()); // true
```
