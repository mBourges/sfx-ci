const CommandStream = require('../lib/command-stream');
const SfdxException = require('../lib/sfdx-exception');

function list(message = 'List orgs') {
  return new Promise((resolve, reject) => {
    const child = new CommandStream('sfdx', ['force:org:list', '--json'], message);

    child.on('done', result => { resolve(result); });
    child.execute();
  });
}

async function getDefaultDevHub() {
  const orgs = await list('Fetching Default DevHub information.');

  if (orgs.status == 1) {
    throw new SfdxException(orgs);
  }

  const { nonScratchOrgs } = orgs.result;

  return nonScratchOrgs.find(org => org.isDefaultDevHubUsername);
}

function display(username) {
  if (!username) {
    throw '[Org] Display: username cannot be empty';
  }

  return new Promise((resolve, reject) => {
    const child = new CommandStream(
      'sfdx',
      ['force:org:display', '-u', username, '--json'],
      `Display ${username} Org information`
    );

    // child.on('pending', () => { console.log('⠇pending') });
    child.on('done', result => { resolve(result); });
    child.execute();
  });
}

async function isDevHub(username) {
  const orgs = await list();
  const { nonScratchOrgs } = orgs.result;
  const org = nonScratchOrgs.find(
    org => org.alias === username ||  org.username === username
  );

  return org.isDevHub;
}

function create(options) {
  return new Promise((resolve, reject) => {
    const { devhub, alias, duration, definitionFile } = options;
    const child = new CommandStream(
      'sfdx',
      ['force:org:create', '--json', '-v', devhub, '-f', definitionFile, '-a', alias, '-d', duration],
      `Create scratch org ${alias} for ${duration} day(s).`);

    child.on('done', result => { resolve(result); });
    child.execute();
  });
}

module.exports = { list, getDefaultDevHub, display, isDevHub, create }