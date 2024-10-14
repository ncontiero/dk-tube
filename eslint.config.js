import { dkshs } from "@dkshs/eslint-config";

export default dkshs({
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
