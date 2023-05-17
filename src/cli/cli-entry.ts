import colorizeLabels from '../utils/colorize-labels';
import filterLabels from '../utils/filter-labels';
import getLabels from '../utils/get-labels';
import args from './cli-args';
import { log } from './logging';

export default async function cliEntry() {
  // Check for required arguments.
  if (!args.owner || !args.repository) {
    log.error(
      'Missing required arguments: `owner` and `repository` (use -o and -r).'
    );
    process.exit(1);
  }

  // Get all labels.
  const labels = await getLabels(args as { owner: string; repository: string });

  // Filter labels.
  if (!args.regex) {
    args.regex = '.*'; // Match everything.
  }

  const selected = await filterLabels(labels, args.regex);

  const selectedBuffer = selected.map(label => label.name);
  log.ok(`Selected the following labels:\n\n${selectedBuffer.join('\n')}`);

  // Colorize labels.
  if (args.color) {
    await colorizeLabels(labels, args);
  }
}
