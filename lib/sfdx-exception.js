module.exports = class SfdxException extends Error {
  constructor({ name, message, actions, stack }){
    super();
    this.name = name;
    this.message = message;
    this.actions = actions;
    this.stack = stack;
  }

  display() {
    console.log(this.name + ': ' + this.message);
  }

  exit() {
    this.display();
    process.exit(1);
  }
}

// console.log(new Error('A standard error'))
// // { [Error: A standard error] }

// console.log(new FancyError('An augmented error'))
// // { [Your fancy error: An augmented error] name: 'FancyError' }


//   name: 'noOrgsFound',
//   message: 'No orgs can be found.',
//   actions: [
//     'Use one of the commands in force:auth or force:org:create to add or create new scratch orgs.'
//   ],
//   commandName: 'OrgListCommand',
//   stack: