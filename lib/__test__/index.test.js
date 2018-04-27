const scope = require("../index");
const util = require("util");

class Clazz {
  constructor() {
    this.test = true;
  }
}

test("scope exists", () => {
  expect(scope).toBeTruthy();
});

describe("Given a scope function", () => {
  let registration;

  beforeEach(() => {
    registration = registry => {
      registry({ type: Clazz });
    };
  });

  it(
    "should resolve fooClazz with type",
    scope(resolve => {
      const instance = resolve(Clazz);
      expect(instance).toBeTruthy();
      console.log(util.inspect(instance));
    //   expect(instance.test).toBe(true);
    })
  );

//   xit(
//     "should resolve fooClazz with name",
//     scope(resolve => {
//       const instance = resolve('Clazz');
//       expect(instance).toBeTruthy();
//     //   expect(instance.test).toBe(true);
//     })
//   );
});
