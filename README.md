# GitHub Label Processor

Our bot creates and modifies many labels. This tool is used to manage them. You can use regular expressions to select labels.

### Help Menu Preview

```log
Label Processor

  Batch operations on GitHub labels.

Options

  -?, --help                Help menu.
  -o, --owner string        Owner or organization hosting the target
                            repository.
  -r, --repository string   Target repository name.
  -c, --color string        Color to use for the label. Must be a six character
                            CSS color string, without the `#` prefix, like
                            `ff0000`.
  -e, --regex string        Regex filter to search for.
  --tool string             Custom scripts with more advanced logic.
  -x, --execute             Execute destructive command (e.g. delete label).
                            Otherwise, just print the dry run.

  Copyright 2023
```

Note: you must include the owner and repository name in the command line arguments, or it will throw an error.

### Tool: Reset Labels to Default Colors

It will reset all labels to grey, and highlight `Price: ` labels with green.

```sh
yarn tools:reset-colors --owner ubiquity --repository=github-labels-processor
```

### Examples

If you would like to set all of the `Priority: ` labels to a specific color, you can run

```sh
yarn start:priority --owner ubiquity --repository github-labels-processor --color=000000
```
