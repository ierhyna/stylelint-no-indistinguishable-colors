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
      const code = `div { color: #000; background: #010101; }`;

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
      const code = `div { color: #000; background: #010101; }`;

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

  describe("ignore", () => {
    it("should ignore selected colors", done => {
      const rules = {
        [ruleName]: [true, { ignore: ["#000000", "#010101"] }]
      };
      const code = `div { color: #000; border: 1px solid #010101; background: #111 }`;

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

  describe("threshold", () => {
    it("should set higher threshold", done => {
      const rules = {
        [ruleName]: [true, { threshold: 10 }]
      };
      const code = `div { color: #000; background: #222; }`;

      return stylelint
        .lint(getOptions(code, rules))
        .then(result => {
          expect(result.errored).toBe(true);
          expect(JSON.parse(result.output)).toMatchSnapshot();
          return done();
        })
        .catch(error => done(error));
    });

    it("should set lower threshold", done => {
      const rules = {
        [ruleName]: [true, { threshold: 1 }]
      };
      const code = `div { color: #000; background: #222; }`;

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

  describe("whitelist", () => {
    it("should ignore selected color pairs", done => {
      const rules = {
        [ruleName]: [true, { whitelist: [["#000000", "#010101"], ["#eeeeee", "#dddddd"]] }]
      };
      const code = `div { color: #000; color: #010101; border: 1px solid #ddd; background: #eee }`;

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

  describe("allowEquivalentNotation", () => {
    it("should disable equivalent notation", done => {
      const rules = {
        [ruleName]: [true, { allowEquivalentNotation: false }]
      };
      const code = `div { color: #000; background: black; border: 1px solid rgb(0,0,0); }`;

      return stylelint
        .lint(getOptions(code, rules))
        .then(result => {
          expect(result.errored).toBe(true);
          expect(JSON.parse(result.output)).toMatchSnapshot();
          return done();
        })
        .catch(error => done(error));
    });

    it("should enable equivalent notation", done => {
      const rules = {
        [ruleName]: [true, { allowEquivalentNotation: true }]
      };
      const code = `div { color: #000; background: black; border: 1px solid rgb(0,0,0); }`;

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

  describe("incorrect parameters", () => {
    it("should display error on incorrect options", done => {
      const rules = {
        [ruleName]: [true, { not_exists: true }]
      };
      const code = `div {}`;

      return stylelint
        .lint(getOptions(code, rules))
        .then(result => {
          expect(result.errored).toBe(true);
          expect(JSON.parse(result.output)).toMatchSnapshot();
          return done();
        })
        .catch(error => done(error));
    });
    it("should display error on incorrect arguments", done => {
      const rules = {
        [ruleName]: [true, { allowEquivalentNotation: ["#eee"] }]
      };
      const code = `div {}`;

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
});
