// import dotenv from 'dotenv';
// import fs from 'fs';
// import { MongoMemoryServer } from 'mongodb-memory-server-global';

// const testEnv = dotenv.parse(fs.readFileSync('.env.test'));

export default async () => {
  // const mongod = new MongoMemoryServer({
  //   autoStart: true,
  //   instance: {
  //     port: parseInt(testEnv.DB_PORT, 10),
  //     dbName: testEnv.DB_NAME,
  //     auth: false,
  //   },
  // });
  process.env.NODE_ENV = 'testing';
  // process.env.MONGO_URI = await mongod.getConnectionString();
  // process.env.MONGO_DBNAME = await mongod.getDbName();
  // process.env.MONGO_DBPATH = await mongod.getDbPath();
  // process.env.MONGO_PORT = await mongod.getPort();
  // global.MONGOD = mongod;
};
