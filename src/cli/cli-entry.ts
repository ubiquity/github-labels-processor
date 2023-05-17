import colorizeLabels from '../utils/colorize-labels';
import args from './cli-args';
import { log } from './logging';

export default async function cliEntry() {
  if (!args.owner || !args.repository) {
    log.error(
      'Missing required arguments: `owner` and `repository` (use -o and -r).'
    );
    process.exit(1);
  }

  if (args.color) {
    await colorizeLabels(args);
  }
}
