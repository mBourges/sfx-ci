const CommandStream = require("../lib/command-stream");

const SFDX_CLI = process.env.SFDX_CLI || "sfdx";

function query({ targetOrg, queryString }, cmdOptions) {
  const loggerOptions = {
    message: `Running query ${queryString} in ${targetOrg}.`,
    ...cmdOptions,
  };
  console.log(queryString);
  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      SFDX_CLI,
      [
        "force:data:soql:query",
        "--usetoolingapi",
        "--query",
        `"${queryString}"`,
        "--targetusername",
        targetOrg,
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

module.exports = { query };
