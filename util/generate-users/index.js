const {MongoDriver} = require('./../../core/drivers');
const UserGenerator = require('./UserGenerator');
const {mongoCredentials} = require('./../../core/config');

const mongoDriver = new MongoDriver(mongoCredentials);
const userQty = 10;

(async () => {
  await mongoDriver.connect();

  const migration = new UserGenerator(userQty);

  console.log('Start generating...');

  try {
    await migration.run();
  } catch (err) {
    console.error('Something went wrong', err);
    process.exit(1);
  }

  console.log('Finish generating');
  process.exit(0);
})();
