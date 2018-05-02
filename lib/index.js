'use strict';

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

  const privResolve = function(key) {
    const entry = registry.find(
      entry =>
        (entry.name && entry.name.toUpperCase() === key) ||
        (entry.type && entry.type.name.toString().toUpperCase() === key)
    );

    const fnToResolve = entry.factory || entry.by || entry.type;

    const fnResolve = entry.factory
      ? func => func(resolve)
      : func =>
          Reflect.construct(func, getDeps(func).map(dep => resolve(dep)));

    const res = entry && (entry.value || fnResolve(fnToResolve));

    return entry.persist ? (instances[key] = res) : res;
  }

  const resolve = type => {
    const key = (typeof type === "string"
      ? type
      : type.name.toString()
    ).toUpperCase();

    let instance =
      instances[key] ||
      privResolve(key);

    if (!instance) throw Error(`Can't Resolve for key ${key}`);

    return instance;
  };

  return (...args) => fn(resolve, ...args);
}

module.exports = scope;
