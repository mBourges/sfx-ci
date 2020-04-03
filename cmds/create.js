const LOG_SYMBOLS = require('../lib/log-symbols');
const { SfdxException } = require('../lib/sfdx-exception');
const { getDefaultDevHub, isDevHub, create } = require('../utils/org');

async function generateOrgOptions(args) {
  let options = {
    devhub: args.devhub || args.b,
    alias:  args.alias || args.a,
    duration:  args.duration || args.d || 1,
    definitionFile: args.file || args.f || './config/project-scratch-def.json'
  }

  if (!options.alias) {
    throw new SfdxException({
      name: 'NoAliasDefined',
      message: 'Org Alias is not defined.'
    });
  }

  if (!options.devhub) {
    console.log(`${LOG_SYMBOLS.info} Devhub not found. Using Default Devhub`);

    const result = await getDefaultDevHub();
    options = {...options, devhub: result.username };

    console.log(`${LOG_SYMBOLS.info} ${options.devhub} will be used as the DevHub.`);
  } else {
    console.log(`${LOG_SYMBOLS.info} Check if ${options.devhub} is a valid Devhub.`);
    const isDev = await isDevHub(options.devhub);
    if (!isDev) {
      console.log(`${LOG_SYMBOLS.error} ${options.devhub} is not a valid Devhub.`);
      throw new SfdxException({
        name: 'NoValidDevHub',
        message: `${options.devhub} is not a valid DevHub.`
      });
    }
    console.log(`${LOG_SYMBOLS.success} ${options.devhub} is a valid Devhub.`);
  }

  return options;
}

module.exports = async (args) => {
  const orgOptions = await generateOrgOptions(args);
  const orgInformation = await create(orgOptions);
  console.log(orgInformation);
}
