import { log } from '../cli/logging';
import { Label } from '../network/label';
import { updateLabel } from '../network/updateLabel';
import filterLabels from './filter-labels';
import getLabels from './get-labels';

// const OWNER = 'ubiquity';
// const REPO = 'pay.ubq.fi';
// const regex = '^Price:.+';

export default async function colorizeLabels(args) {
  const results = await getLabels(args);
  if (!args.regex) {
    args.regex = '.*';
  }
  const SEARCH_QUERY_REGEX = new RegExp(args.regex); // "^Price:.+USDC$"
  const selected = await filterLabels(results, SEARCH_QUERY_REGEX);

  const selectedBuffer = selected.map(label => label.name);
  log.ok(`Selected the following labels:\n\n${selectedBuffer.join('\n')}`);

  selected.forEach(
    async (label: Label) => await updateLabel(args, label.name, args)
  );
}
