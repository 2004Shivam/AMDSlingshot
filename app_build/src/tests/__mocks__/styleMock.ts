// CSS Modules mock — returns a Proxy so any className lookup returns the key itself
const handler: ProxyHandler<Record<string, string>> = {
  get(_target, prop: string) {
    return prop;
  },
};

export default new Proxy({}, handler);
