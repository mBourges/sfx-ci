const CommandStream = require("../lib/command-stream");
const SfdxException = require("../lib/sfdx-exception");

const SFDX_CLI = process.env.SFDX_CLI || "sfdx";

function list(cmdOptions) {
  const options = { ...cmdOptions, message: cmdOptions.message || "List Orgs" };
  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      ["force:org:list", "--json"],
      options
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

async function getDefaultDevHub(cmdOptions) {
  const options = {
    ...cmdOptions,
    message: "Fetching Default DevHub information.",
  };
  const orgs = await list(options);

  if (orgs.status == 1) {
    throw new SfdxException(orgs);
  }

  const { nonScratchOrgs } = orgs.result;

  return nonScratchOrgs.find((org) => org.isDefaultDevHubUsername);
}

function display(username) {
  if (!username) {
    throw "[Org] Display: username cannot be empty";
  }

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      ["force:org:display", "-u", username, "--json"],
      `Display ${username} Org information`
    );

    // child.on('pending', () => { console.log('⠇pending') });
    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

async function isDevHub(username, cmdOptions) {
  const orgs = await list(cmdOptions);
  const { nonScratchOrgs } = orgs.result;
  const org = nonScratchOrgs.find(
    (org) => org.alias === username || org.username === username
  );

  return org && org.isDevHub;
}

function create(options, cmdOptions) {
  const { devhub, alias, duration, definitionFile } = options;
  const loggerOptions = {
    ...cmdOptions,
    message: `Create scratch org ${alias} for ${duration} day(s).`,
  };

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      [
        "force:org:create",
        "--json",
        "-v",
        devhub,
        "-f",
        definitionFile,
        "-a",
        alias,
        "-d",
        duration,
      ],
      loggerOptions
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

module.exports = { list, getDefaultDevHub, display, isDevHub, create };
