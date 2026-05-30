import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let replSet: MongoMemoryReplSet;

export const connectTestDb = async () => {
  replSet = await MongoMemoryReplSet.create({
    replSet: { storageEngine: 'wiredTiger' }
  });
  const uri = replSet.getUri();
  await mongoose.connect(uri);
};

export const closeTestDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (replSet) {
    await replSet.stop();
  }
};

export const clearTestDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};
