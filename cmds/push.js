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
  const orgOptions = await generateOrgOptions(args);
  const results = await push(orgOptions);

  if (results.status == 1) {
    throw new SfdxPushException(results);
  }

  console.log(JSON.stringify(results, null, 2));
}