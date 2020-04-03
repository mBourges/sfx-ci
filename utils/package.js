const CommandStream = require('../lib/command-stream');

function create({ devhub, name }) {
  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      'sfdx',
      ['force:package:version:create', '--json', '-v', devhub, '-p', name, '-x'],
      `Start ${name} package version creation on ${devhub}`
    );

    child.on('done', result => { resolve(result); });
    child.execute();
  });
}

function report({ devhub, requestId }) {
  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      'sfdx',
      ['force:package:version:create:report', '-v', devhub, '-i', requestId, '--json'],
      `Checking ${requestId} package version creation`
    );

    child.on('done', result => { resolve(result); });
    child.execute();
  });
}

function install({ targetOrg, packageVersionId }) {
  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      'sfdx',
      ['force:package:install', '--json', '--targetusername', targetOrg, '--noprompt', '--package', packageVersionId],
      `Start ${packageVersionId} package version installation in ${targetOrg}.`
    );

    child.on('done', result => { resolve(result); });
    child.execute();
  });
}

function reportInstallation({ targetOrg, requestId }) {
  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      'sfdx',
      ['force:package:install:report', '--json', '-i', requestId, '-u', targetOrg],
      `Checking ${requestId} package version installation in ${targetOrg}.`
    );

    child.on('done', result => { resolve(result); });
    child.execute();
  });
}

module.exports = { create, report, install, reportInstallation }

// sfdx force:package:create -v devhub-perso -n demo-package -t Unlocked -r ./force-app
