const CommandStream = require("../lib/command-stream");

const SFDX_CLI = process.env.SFDX_CLI || "sfdx";

function create({ devhub, name }, cmdOptions) {
  const loggerOptions = {
    ...cmdOptions,
    message: `Start ${name} package version creation on ${devhub}`,
  };

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      [
        "force:package:version:create",
        "--json",
        "-v",
        devhub,
        "-p",
        name,
        "-x",
      ],
      loggerOptions
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

function report({ devhub, requestId }, cmdOptions) {
  const loggerOptions = {
    message: `Checking ${requestId} package version creation`,
    ...cmdOptions,
  };

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      [
        "force:package:version:create:report",
        "-v",
        devhub,
        "-i",
        requestId,
        "--json",
      ],
      loggerOptions
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

function install({ targetOrg, packageVersionId }, cmdOptions) {
  const loggerOptions = {
    message: `Start ${packageVersionId} package version installation in ${targetOrg}.`,
    ...cmdOptions,
  };

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      [
        "force:package:install",
        "--json",
        "--targetusername",
        targetOrg,
        "--noprompt",
        "--package",
        packageVersionId,
      ],
      loggerOptions
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

function reportInstallation({ targetOrg, requestId }, cmdOptions) {
  const loggerOptions = {
    message: `Checking ${requestId} package version installation in ${targetOrg}.`,
    ...cmdOptions,
  };

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      [
        "force:package:install:report",
        "--json",
        "-i",
        requestId,
        "-u",
        targetOrg,
      ],
      loggerOptions
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

module.exports = { create, report, install, reportInstallation };

// sfdx force:package:create -v devhub-perso -n demo-package -t Unlocked -r ./force-app
