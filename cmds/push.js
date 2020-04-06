const LOG_SYMBOLS = require('../lib/log-symbols');
const { SfdxException, SfdxPushException } = require('../lib/sfdx-exception');
const { push } = require('../utils/source');

async function generateOrgOptions(args) {
  let options = { alias:  args.alias || args.a };

  if (!options.alias) {
    throw new SfdxException({
      name: 'NoAliasDefined',
      message: 'Org Alias is not defined.'
    });
  }

  return options;
}

module.exports = async (args) => {
  const cmdOptions = { verbose: args.verbose || false };
  const orgOptions = await generateOrgOptions(args);
  const results = await push(orgOptions, cmdOptions);

  if (results.status == 1) {
    throw new SfdxPushException(results);
  }

  process.stdout.write(JSON.stringify(results));
}