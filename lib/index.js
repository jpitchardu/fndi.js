const functionRegex = /(?:(?:function)|(?:constructor))\s*[^\(]*\(\s*([^\)]*)\)/m;

function getDeps(fn) {
  return fn.length > 0
    ? fn
        .toString()
        .match(functionRegex)[1]
        .replace(/ /g, "")
        .split(",")
    : [];
}

function scope(registration, fn) {
  let registry = [];
  let instances = {};

  const registryFn = entry => (registry = [...registry, entry]);

  registration(registryFn);

  const resolve = type => {
        const key = (typeof type === 'string'
      ? type
      : type.name.toString()
    ).toUpperCase();

    
    let instance =
      instances[key] ||
      (function() {
        const entry = registry.find(
          entry =>
            (entry.name && entry.name.toUpperCase() === key) ||
            entry.type.name.toString().toUpperCase() === key
        );
        const res =
          entry &&
          (entry.factory
            ? entry.factory(resolve)
            : Reflect.construct(
                entry.type,
                getDeps(entry.type).map(dep => resolve(dep))
              ));

        return res;
      })();

    if (!instance) throw Error(`Can't Resolve for key ${key}`);

    return instance;
  };

  return (...args) => fn(resolve, ...args);
}

module.exports = scope;