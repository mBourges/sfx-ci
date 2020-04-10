const CommandStream = require("../lib/command-stream");

const SFDX_CLI = process.env.SFDX_CLI || "sfdx";

function push({ alias }, cmdOptions) {
  const loggerOptions = { ...cmdOptions, message: `Push sources to ${alias}` };

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      ["force:source:push", "--json", "-u", alias, "-w", "60"],
      loggerOptions
    );

    child.on("done", (result) => {
      resolve(result);
    });
    child.execute();
  });
}

module.exports = { push };
