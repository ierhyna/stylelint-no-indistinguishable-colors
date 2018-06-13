const stylelint = require("stylelint");
const colorguard = require("colorguard");
const Result = require("postcss/lib/result");

const ruleName = "plugin/stylelint-no-indistinguishable-colors";
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (a, b) => `Unexpected indistinguishable colors "${a}" and "${b}".`
});

module.exports = stylelint.createPlugin(
  ruleName,
  (primaryOption, secondaryOptionObject) => {
    return (postcssRoot, postcssResult) => {
      const validOptions = stylelint.utils.validateOptions(
        postcssResult,
        ruleName,
        {
          actual: primaryOption
        }
      );

      if (!validOptions) {
        return;
      }

      const colorguardResult = new Result();

      colorguard(primaryOption)(postcssRoot, colorguardResult);

      colorguardResult.warnings().forEach(warning => {
        const message = messages.rejected(
          warning.secondColor,
          warning.firstColor
        );
        stylelint.utils.report({
          ruleName,
          result: postcssResult,
          message,
          node: warning.node,
          line: warning.line,
          column: warning.column
        });
      });
    };
  }
);

module.exports.ruleName = ruleName;
module.exports.messages = messages;
