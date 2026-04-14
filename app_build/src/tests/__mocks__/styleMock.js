// CSS Module mock: returns className key as string
module.exports = new Proxy({}, {
  get: (_, prop) => prop,
});
