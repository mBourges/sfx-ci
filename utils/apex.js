const CommandStream = require("../lib/command-stream");

const SFDX_CLI = process.env.SFDX_CLI || "sfdx";

function runTests({ targetOrg }, cmdOptions) {
  const loggerOptions = {
    message: `Start running tests in ${targetOrg}.`,
    ...cmdOptions,
  };

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      ["force:apex:test:run", "-u", targetOrg, "-l", "RunLocalTests", "--json"],
      loggerOptions
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

function report({ targetOrg, testRunId, outputFolder }, cmdOptions) {
  const loggerOptions = {
    message: `Reporting tests in ${targetOrg}.`,
    ...cmdOptions,
  };

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      [
        "force:apex:test:report",
        "--json",
        "-r",
        "junit",
        "-u",
        targetOrg,
        "-i",
        testRunId,
        "-c",
        "-d",
        outputFolder,
      ],
      loggerOptions
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

module.exports = { runTests, report };
