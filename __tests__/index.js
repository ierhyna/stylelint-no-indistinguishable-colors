const { lint } = require("stylelint");
const plugin = require("../lib");
const ruleName = plugin.ruleName;

function getOptions(code, rules) {
  return {
    code,
    configBasedir: __dirname,
    config: {
      plugins: "../lib",
      rules,
    },
  };
}

describe("stylelint-no-indistinguishable-colors", () => {
  describe("true option", () => {
    it("should enable rule", async () => {
      const rules = {
        [ruleName]: true,
      };
      const code = `div { color: #000; background: #010101; }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(true);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: true,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [
            {
              column: 20,
              endColumn: 40,
              endLine: 1,
              line: 1,
              rule: "plugin/stylelint-no-indistinguishable-colors",
              severity: "error",
              text: expect.any(String),
            },
          ],
        }),
      });
    });
  });

  describe("false option", () => {
    it("should disable rule", async () => {
      const rules = {
        [ruleName]: null,
      };
      const code = `div { color: #000; background: #010101; }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(false);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: false,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [],
        }),
      });
    });
  });

  describe("ignore", () => {
    it("should ignore selected colors", async () => {
      const rules = {
        [ruleName]: [true, { ignore: ["#000", "#010101"] }],
      };
      const code = `div { color: #000; border: 1px solid #010101; background: #111 }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(false);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: false,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [],
        }),
      });
    });
  });

  describe("threshold", () => {
    it("should set higher threshold", async () => {
      const rules = {
        [ruleName]: [true, { threshold: 10 }],
      };
      const code = `div { color: #000; background: #222; }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(true);
      //TODO: fix this
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: true,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [
            {
              column: 20,
              endColumn: 37,
              endLine: 1,
              line: 1,
              rule: "plugin/stylelint-no-indistinguishable-colors",
              severity: "error",
              text: expect.any(String),
            },
          ],
        }),
      });
    });

    it("should set lower threshold", async () => {
      const rules = {
        [ruleName]: [true, { threshold: 1 }],
      };
      const code = `div { color: #000; background: #222; }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(false);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: false,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [],
        }),
      });
    });
  });

  describe("whitelist", () => {
    it("should ignore selected color pairs", async () => {
      const rules = {
        [ruleName]: [
          true,
          {
            whitelist: [
              ["#000", "#010101"],
              ["#eee", "#ddd"],
            ],
          },
        ],
      };
      const code = `div { color: #000; color: #010101; border: 1px solid #ddd; background: #eee }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(false);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: false,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [],
        }),
      });
    });
  });

  describe("allowEquivalentNotation", () => {
    it("should disable equivalent notation", async () => {
      const rules = {
        [ruleName]: [true, { allowEquivalentNotation: false }],
      };
      const code = `div { color: #000; background: black; border: 1px solid rgb(0,0,0); }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(true);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: true,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [
            {
              column: 20,
              endColumn: 38,
              endLine: 1,
              line: 1,
              rule: "plugin/stylelint-no-indistinguishable-colors",
              severity: "error",
              text: expect.any(String),
            },
            {
              column: 39,
              endColumn: 68,
              endLine: 1,
              line: 1,
              rule: "plugin/stylelint-no-indistinguishable-colors",
              severity: "error",
              text: expect.any(String),
            },
            {
              column: 39,
              endColumn: 68,
              endLine: 1,
              line: 1,
              rule: "plugin/stylelint-no-indistinguishable-colors",
              severity: "error",
              text: expect.any(String),
            },
          ],
        }),
      });
    });

    it("should enable equivalent notation", async () => {
      const rules = {
        [ruleName]: [true, { allowEquivalentNotation: true }],
      };
      const code = `div { color: #000; background: black; border: 1px solid rgb(0,0,0); }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(false);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: false,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [],
        }),
      });
    });
  });

  describe("incorrect parameters", () => {
    it("should display error on incorrect options", async () => {
      const rules = {
        [ruleName]: [true, { not_exists: true }],
      };
      const code = `div {}`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(true);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: true,
          invalidOptionWarnings: [
            {
              text: expect.any(String),
            },
          ],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [],
        }),
      });
    });
    it("should display error on incorrect arguments", async () => {
      const rules = {
        [ruleName]: [true, { allowEquivalentNotation: ["#eee"] }],
      };
      const code = `div {}`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(true);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: true,
          invalidOptionWarnings: [
            {
              text: expect.any(String),
            },
          ],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [],
        }),
      });
    });
  });

  describe("no side-effects", () => {
    it("should ignore color names in font-family", async () => {
      const rules = {
        [ruleName]: true,
      };
      const code = `div { background: #fff; font-family: "Arial Black"; }`;

      const result = await lint(getOptions(code, rules));
      expect(result.errored).toBe(false);
      expect({ Result: JSON.parse(result.output) }).toMatchSnapshot({
        Result: Array(1).fill({
          deprecations: [],
          errored: false,
          invalidOptionWarnings: [],
          parseErrors: [],
          source: expect.stringMatching("^<input.*css.*>$"),
          warnings: [],
        }),
      });
    });
  });
});
