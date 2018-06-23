const colorguard = require("colorguard");
const Result = require("postcss/lib/result");
const stylelint = require("stylelint");
const isValidHex = require("stylelint/lib/utils/isValidHex");

const ruleName = "plugin/stylelint-no-indistinguishable-colors";
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (a, b) => `Unexpected indistinguishable colors "${a}" and "${b}".`
});

module.exports = stylelint.createPlugin(
  ruleName,
  (primaryOption, secondaryOptions) => (postcssRoot, postcssResult) => {
    const validOptions = stylelint.utils.validateOptions(
      postcssResult,
      ruleName,
      {
        actual: primaryOption,
        possible: [true, false]
      },
      {
        optional: true,
        actual: secondaryOptions,
        possible: {
          ignore: isValidHex,
          threshold: x => Number.isInteger(x) && x >= 0 && x <= 100,
          whitelist: x => Array.isArray(x) && x.every(isValidHex),
          allowEquivalentNotation: [true, false]
        }
      }
    );

    if (!validOptions) {
      return;
    }

    if (primaryOption) {
      const colorguardResult = new Result();

      colorguard(secondaryOptions)(postcssRoot, colorguardResult);

      colorguardResult.warnings().forEach(warning => {
        const message = messages.rejected(warning.secondColor, warning.firstColor);
        stylelint.utils.report({
          ruleName,
          result: postcssResult,
          message,
          node: warning.node,
          line: warning.line,
          column: warning.column
        });
      });
    }
  }
);

module.exports.ruleName = ruleName;
module.exports.messages = messages;
