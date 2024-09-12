import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginJs.configs["recommended-requiring-type-checking"],
  pluginJs.configs["recommended-without-type-checking"],
  pluginJs.configs["recommended-with-type-checking"],
  pluginJs.configs["recommended-without-type-checking-and-modules"],
];