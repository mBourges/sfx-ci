const Logger = require("../lib/logger");
const { SfdxException } = require("../lib/sfdx-exception");
const { getDefaultDevHub, isDevHub, create } = require("../utils/org");

async function generateOrgOptions(args, cmdOptions) {
  const logger = new Logger(cmdOptions);
  let options = {
    devhub: args.devhub || args.v,
    alias: args.alias || args.a,
    duration: args.duration || args.d || 1,
    definitionFile: args.file || args.f || "./config/project-scratch-def.json",
  };

  if (!options.alias) {
    throw new SfdxException({
      name: "NoAliasDefined",
      message: "Org Alias is not defined.",
    });
  }

  if (!options.devhub) {
    logger.info("Devhub not found. Using Default Devhub");

    const result = await getDefaultDevHub(cmdOptions);
    options = { ...options, devhub: result.username };

    logger.info(`${options.devhub} will be used as the DevHub.`);
  } else {
    logger.info(`Check if ${options.devhub} is a valid Devhub.`);

    const isDev = await isDevHub(options.devhub, cmdOptions);

    if (!isDev) {
      logger.error(`${options.devhub} is not a valid Devhub.`);

      throw new SfdxException({
        name: "NoValidDevHub",
        message: `${options.devhub} is not a valid DevHub.`,
      });
    }

    logger.success(`${options.devhub} is a valid Devhub.`);
  }

  return options;
}

module.exports = async (args) => {
  const cmdOptions = { verbose: args.verbose || false };
  const orgOptions = await generateOrgOptions(args, cmdOptions);
  const orgInformation = await create(orgOptions, cmdOptions);

  process.stdout.write(JSON.stringify(orgInformation));
};
