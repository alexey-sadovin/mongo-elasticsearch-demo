const {MongoDriver, ElasticDriver} = require('./../../core/drivers');
const {mongoCredentials, elasticCredentials} = require('./../../core/config');
const MongoElasticMigration = require('./MongoElasticMigration');

const mongoDriver = new MongoDriver(mongoCredentials);
const elasticDriver = new ElasticDriver(elasticCredentials);

(async () => {
  await mongoDriver.connect();
  await elasticDriver.connect();

  const migration = new MongoElasticMigration(elasticDriver);

  console.log('Start migration...');

  try {
    await migration.run();
  } catch (err) {
    console.error('Something went wrong', err);
    process.exit(1);
  }

  console.log('Finish migration');
  process.exit(0);
})();
