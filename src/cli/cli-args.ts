import commandLineArgs from "command-line-args";
import commandLineUsage from "command-line-usage";

const optionDefinitions = [
  { name: "help", type: Boolean, alias: "?", description: "Help menu." },
  {
    name: "owner",
    type: String,
    alias: "o",
    description: "Owner or organization hosting the target repository.",
  },
  {
    name: "repository",
    type: String,
    alias: "r",
    description: "Target repository name.",
  },
  {
    name: "color",
    type: String,
    alias: "c",
    description:
      "Color to use for the label. Must be a six character CSS color string, without the `#` prefix, like `ff0000`.",
  },
  {
    name: "regex",
    type: String,
    alias: "e",
    description: "Regex filter to search for.",
  },
  {
    name: "tool",
    type: String,
    description: "Custom scripts with more advanced logic.",
  },
];

export default (function readCommandLineArgs() {
  const options = commandLineArgs(optionDefinitions);
  if (options.help) {
    displayHelpMenu();
  } else {
    displayInputArgs(options);
  }
  return options;
})();

function displayInputArgs(options: commandLineArgs.CommandLineOptions) {
  if (Object.keys(options).length) {
    console.log(`<<`, options);
  }
}

function displayHelpMenu() {
  const usage = commandLineUsage([
    {
      header: "Label Processor",
      content: "Batch operations on GitHub labels.",
    },
    { header: "Options", optionList: optionDefinitions },
    { content: "Copyright 2023" },
  ]);
  console.log(usage);
  process.exit(0);
}
