const menus = {
  main: `
    sfdx-ci [command] <options>

    create ............. create a scracth org
    delete ............. delete a scratch org
    push ............... push code to a scratch org
    package ............ create a new package version
    install ............ install a package to an org
    version ............ show package version

    --help, -h ......... show help for a command`,

  create: `
    sfdx-cli create <options>

    --devhub, -v ........ devhub to use, Default: default devhub
    --alias, -a ......... alias for the org, mandatory
    --duration, -d ...... scratch duration, default: 1
    --file, -f .......... definition file to use, default: './config/project-scratch-def.json'
    --verbose .......... verbose mode`,

  push: `
    sfdx-cli push <options>

    --alias, -a ......... alias for the org, mandatory
    --verbose .......... verbose mode`,

  test: `
    sfdx-cli test <options>

    --alias, -a ......... alias for the org, mandatory
    --folder, -f ........ test results folder, default: './test-results'
    --verbose .......... verbose mode`,

  package: `
    sfdx-cli package <options>

    --name, -n ......... Package name to create a version for
    --tag, -t .......... Package tag, i.e. git commit sha
    --devhub, -v ....... devhub to use, Default: default devhub
    --verbose ......... verbose mode`,

  install: `
    sfdx-cli install <options>

    --devhub, -v ....... devhub to use, Default: default devhub
    --alias, -a ....... Target org for installation
    --name, -n ........ Package to install
    --tag, -t ......... Tag to install
    --verbose ........ verbose mode`,
};

module.exports = (args) => {
  const subCmd = args._[0] === "help" ? args._[1] : args._[0];

  process.stdout.write(menus[subCmd] || menus.main);
};
