import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 86400,
  checkperiod: 120,
});

export default cache;
