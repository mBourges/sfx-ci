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

    --devhub, -b ........ devhub to use, Default: default devhub
    --alias, -a ......... alias for the org, mandatory
    --duration, -d ...... scratch duration, default: 1
    --file, -f .......... definition file to use, default: './config/project-scratch-def.json'`,
}

module.exports = (args) => {
  const subCmd = args._[0] === 'help'
    ? args._[1]
    : args._[0]

  console.log(menus[subCmd] || menus.main)
}