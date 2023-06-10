const config = {
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true,
  },
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};

module.exports = config;
