const Listr = require('listr');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(`${process.env.DB_URL}${process.env.DB_NAME}`, {
  autoIndex: false,
  // useNewUrlParser: true,
  // useFindAndModify: false,
  // useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => {
  if (err) {
    throw new Error(`Unable to connect to database: ${err.toString()}`);
  }
});

const fakeUsers = require('./fakeUsers');

const destroyDB = () => ([
  {
    title: 'Remove All Collections in Database',
    task: async () => {
      await mongoose.connection.dropDatabase();
    },
  },
]);

const pumpItUp = () => ([
  ...destroyDB(),
  ...[
    {
      title: 'Create data simple for User model 📺 👌',
      task: async () => {
        await fakeUsers();
      },
    },
  ],
]);

async function kickoff(tasks) {
  await tasks.run();
  process.exit();
}

if (process.argv.includes('--destroy')) {
  const cleanUp = destroyDB();
  kickoff(new Listr(cleanUp));
} else {
  const pumpIt = pumpItUp();
  kickoff(new Listr(pumpIt));
}
