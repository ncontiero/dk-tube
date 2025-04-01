import { ncontiero } from "@ncontiero/eslint-config";

export default ncontiero({
  isInEditor: false,
  javascript: {
    overrides: {
      "node/no-unsupported-features/node-builtins": [
        "error",
        { allowExperimental: true },
      ],
    },
  },
  unicorn: {
    overrides: {
      "unicorn/consistent-function-scoping": [
        "error",
        { checkArrowFunctions: false },
      ],
    },
  },
});
