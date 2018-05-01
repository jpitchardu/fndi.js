# fnDI.js

Simple, functional, ligthweight, dependencyless DI/IOC library for JS

## Usage

Install using yarn or npm

```bash
yarn add fndi

npm install fndi
```

Getting started

```javascript
// Function sintax
const scope = require('fndi');

function A() {}

// Class Sintax
class B {
  constructor(a) {
    this.a = a;
  }
}

// Registration Function
const registration = registry => {
  registry({ type: A });
  registry({ type: B });
};

function main(resolve, args) {
  const bInstance = resolve(B);
}

const scopedMain = scope(registration, main);

scopedMain(args);
```

## Register

The registration is done within a function that takes a `registry` function as
argument.

```javascript
const registration = registry => {

  //Only type registry
  registry({ type: MyTypedClass });

  // Named Registry
  registry({ name: 'MyNamedInstance', type: MyNamedClass });

  // Provide a single instance every time
  registry({ type: MyClassWithValue, value: { a: 1 } });

  // Registering a Factory function
  registry({
    type: MyClassWithFactory,
    factory: resolve => resolve(MyClassWithFactory);
  });

  // Delegate the class
  registry({
    type: MyDelegatedClass,
    by: AnotherCompletelyDifferentClass
  })

};
```

### Registry Entry

Each registry entry (the argument for the `registry` function) must follow the
following definition:

```typescript
interface Entry<T> {
  name?: string;
  type: Type<T>;
  value?: T;
  factory?: resolve: Function => T;
  by?: Type;
  persist?: boolean;
}
```

## Scopes

`scope` is a function wrapper, it provides a `resolve` function which can be
used in the underlying function to get instances of the defined types (by either
type or name).

```js
function main(resolve, arg1, arg2) {
  const fooInstance = resolve(Foo);
  const barInstance = resolve('BarRegistryName');
}

const scopedMain = scope(registration, main);

scopedMain(arg1, arg2);
```

# TODO

- [ ] async dependencies
- [ ] Lazy dependencies