class SfdxException extends Error {
  constructor({ name, message, actions, stack, ...rest }){
    super();
    this.name = name;
    this.message = message;
    this.actions = actions;
    this.stack = stack;
    this.metadata = rest;
  }

  display() {
    console.log(this.name + ': ' + this.message);
  }

  exit() {
    this.display();
    process.exit(1);
  }
}

class SfdxPushException extends SfdxException {
  constructor(args) {
    super(args);
  }

  display() {
    console.log(this.name + ': ' + this.message);
    console.log(this.metadata.result);
  }
}


module.exports = { SfdxException, SfdxPushException };