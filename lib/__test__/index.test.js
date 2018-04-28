const scope = require('../index');

const mockFn = jest.fn();

class Clazz {
  constructor() {
    this.test = true;
  }
}

class ClazzWithDependency {
  constructor(clazz) {
    this.clazz = clazz;
  }
}

test('scope exists', () => {
  expect(scope).toBeTruthy();
});

describe('Given a scope function', () => {
  describe('And classes registry by type only', () => {
    let registration = registry => {
      registry({ type: Clazz });
      registry({ type: ClazzWithDependency });
    };

    test(
      'should resolve Clazz by type',
      scope(registration, resolve => {
        const instance = resolve(Clazz);

        expect(instance).toBeInstanceOf(Clazz);
        expect(instance.test).toBe(true);
      })
    );

    test(
      'should resolve Clazz by name',
      scope(registration, resolve => {
        const instance = resolve('Clazz');

        expect(instance).toBeInstanceOf(Clazz);
        expect(instance.test).toBe(true);
      })
    );

    test(
      'should resolve ClazzWithDependency correctly by type ',
      scope(registration, resolve => {
        const instance = resolve(ClazzWithDependency);

        expect(instance).toBeTruthy();
        expect(instance).toBeInstanceOf(ClazzWithDependency);

        expect(instance.clazz).toBeInstanceOf(Clazz);
        expect(instance.clazz.test).toBe(true);
      })
    );
    test(
      'should resolve ClazzWithDependency correctly by name ',
      scope(registration, resolve => {
        const instance = resolve('ClazzWithDependency');

        expect(instance).toBeTruthy();
        expect(instance).toBeInstanceOf(ClazzWithDependency);

        expect(instance.clazz).toBeInstanceOf(Clazz);
        expect(instance.clazz.test).toBe(true);
      })
    );
  });

  describe('And classes register by name', () => {
    let registration = registry => {
      registry({ type: Clazz });
      registry({ name: 'dependencyClazz', type: ClazzWithDependency });
    };

    test(
      'should resolve ClazzWithDependency correctly by name ',
      scope(registration, resolve => {
        const instance = resolve('dependencyClazz');

        expect(instance).toBeTruthy();
        expect(instance).toBeInstanceOf(ClazzWithDependency);

        expect(instance.clazz).toBeInstanceOf(Clazz);
        expect(instance.clazz.test).toBe(true);
      })
    );
  });

  describe('And classes register a factory', () => {
    const factoryFn = mockFn.mockImplementation(
      resolve => new ClazzWithDependency()
    );

    let registration = registry => {
      registry({ type: Clazz });
      registry({ type: ClazzWithDependency, factory: factoryFn });
    };

    test(
      'should resolve ClazzWithDependency correctly using factory',
      scope(registration, resolve => {
        const instance = resolve(ClazzWithDependency);

        expect(factoryFn).toHaveBeenCalled();

        expect(instance).toBeTruthy();
        expect(instance).toBeInstanceOf(ClazzWithDependency);

        expect(instance.clazz).toBeFalsy();
      })
    );
  });

  describe('And classes register a value', () => {
    let registration = registry => {
      registry({ type: Clazz });
      registry({ type: ClazzWithDependency, value: 1 });
    };

    test(
      'should resolve ClazzWithDependency with correct value',
      scope(registration, resolve => {
        const instance = resolve(ClazzWithDependency);

        expect(instance).toBe(1);
      })
    );
  });
});
