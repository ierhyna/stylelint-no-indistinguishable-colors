const stylelint = require("stylelint");
const plugin = require("../lib");
const ruleName = plugin.ruleName;

function getOptions(code, rules) {
  return {
    code,
    configBasedir: __dirname,
    config: {
      plugins: "../lib",
      rules
    }
  };
}

describe("stylelint-no-indistinguishable-colors", () => {
  describe("true option", () => {
    it("should enable rule", done => {
      const rules = {
        [ruleName]: true
      };
      const code = `div { color: #000; color: #010101; }`;

      return stylelint
        .lint(getOptions(code, rules))
        .then(result => {
          expect(result.errored).toBe(true);
          expect(JSON.parse(result.output)).toMatchSnapshot();
          return done();
        })
        .catch(error => done(error));
    });
  });

  describe("false option", () => {
    it("should disable rule", done => {
      const rules = {
        [ruleName]: false
      };
      const code = `div { color: #000; color: #010101; }`;

      return stylelint
        .lint(getOptions(code, rules))
        .then(result => {
          expect(result.errored).toBe(false);
          expect(JSON.parse(result.output)).toMatchSnapshot();
          return done();
        })
        .catch(error => done(error));
    });
  });
});
