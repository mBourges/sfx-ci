const LOG_SYMBOLS = require('../lib/log-symbols');
const SfdxException = require('../lib/sfdx-exception');
const { getDefaultDevHub, isDevHub, create } = require('../utils/org');

async function generateOrgOptions(args) {
  let options = {
    devhub: args.devhub || args.b,
    alias:  args.alias || args.a,
    duration:  args.duration || args.d || 1,
    definitionFile: args.file || args.f || './config/project-scratch-def.json'
  }

  if (!options.alias) {
    throw new SfdxException({
      name: 'NoAliasDefined',
      message: 'Org Alias is not defined.'
    });
  }

  if (!options.devhub) {
    console.log(`${LOG_SYMBOLS.info} Devhub not found. Using Default Devhub`);

    const result = await getDefaultDevHub();
    options = {...options, devhub: result.username };

    console.log(`${LOG_SYMBOLS.info} ${options.devhub} will be used as the DevHub.`);
  } else {
    console.log(`${LOG_SYMBOLS.info} Check if ${options.devhub} is a valid Devhub.`);
    const isDev = await isDevHub(options.devhub);
    if (!isDev) {
      console.log(`${LOG_SYMBOLS.error} ${options.devhub} is not a valid Devhub.`);
      throw new SfdxException({
        name: 'NoValidDevHub',
        message: `${options.devhub} is not a valid DevHub.`
      });
    }
    console.log(`${LOG_SYMBOLS.success} ${options.devhub} is a valid Devhub.`);
  }

  return options;
}

module.exports = async (args) => {
  const orgOptions = await generateOrgOptions(args);
  console.log(orgOptions);
  const orgInformation = await create(orgOptions);
  console.log(orgInformation);
}

// const DEVHUB_NAME = process.argv[3];
// const SCRATCH_ORG_NAME = process.argv[2];

// bootstrap();

// async function bootstrap() {
//   let scratchOrgOptions = {
//     devhub: null,
//     alias: SCRATCH_ORG_NAME,
//     duration: 1,
//     definitionFile: './demo/config/project-scratch-def.json'
//   }

//   if (!SCRATCH_ORG_NAME) {
//     console.log(`${LOG_SYMBOLS.error} Scratch should not be empty.`);
//     return;
//   }

//   try {
//     if (DEVHUB_NAME) {
//       console.log(`${LOG_SYMBOLS.info} Devhub not found. Using Default Devhub`);

//       const isDev = await isDevHub(DEVHUB_NAME);
//       if (isDev) {
//         scratchOrgOptions = {...scratchOrgOptions, devhub: DEVHUB_NAME };
//       } else {
//         throw 'error'
//       }
//     } else {
//       const result = await getDefaultDevHub();
//       const devhub = result.username;
//       scratchOrgOptions = {...scratchOrgOptions, devhub };
//       console.log(`${LOG_SYMBOLS.info} ${devhub} will be used as the DevHub.`);
//     }
//   } catch (error) {
//     error.display(2);
//   }

//   const scratchOrgInformation = await create(scratchOrgOptions);
//   // {
//   //   status: 0,
//   //   result: {
//   //     orgId: '00D5D0000009bWJUAY',
//   //     username: 'test-vgktngysm36c@example.com'
//   //   }
//   // }
// }




// // list()
// //   .then(result => console.log(result))

// // isDevHub(process.argv[2])
// //   .then(result => console.log(result))


// function isContextMissing() {
//   let result = false;

//   if (!DEVHUB_NAME) {
//     console.log(`${LOG_SYMBOLS.info} Devhub not found. Using Default Devhub`);
//   }

//   if (!SCRATCH_ORG_NAME) {
//     console.log(`${LOG_SYMBOLS.error} Scratch should not be empty.`);
//     result = true;
//   }

//   return result
// }