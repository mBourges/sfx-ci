const minimist = require("minimist");

module.exports = async () => {
  const args = minimist(process.argv.slice(2));
  let cmd = args._.length != 1 ? "help" : args._[0];

  if (!args._[0] && (args.version || args.v)) {
    cmd = "version";
  }

  if (args.help || args.h) {
    cmd = "help";
  }
  try {
    switch (cmd) {
      case "create":
        await require("./cmds/create")(args);
        break;

      case "push":
        await require("./cmds/push")(args);
        break;

      case "test":
        await require("./cmds/test")(args);
        break;

      case "package":
        await require("./cmds/package")(args);
        break;

      case "install":
        await require("./cmds/install")(args);
        break;

      case "version":
        require("./cmds/version")();
        break;

      case "help":
        require("./cmds/help")(args);
        break;

      default:
        console.error(`"${cmd}" is not a valid command!`);
        break;
    }
  } catch (exception) {
    if (exception.exit) {
      exception.exit();
    } else {
      console.log(exception);
    }
  }
};
