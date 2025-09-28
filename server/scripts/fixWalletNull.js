// Script to fix walletAddress: '' to walletAddress: null for all users
const mongoose = require('mongoose');
const User = require('../src/models/User');
const env = require('../src/config/env');

async function main() {
  await mongoose.connect(env.mongodbUri, { dbName: env.mongodbName });
  const result = await User.updateMany(
    { walletAddress: '' },
    { $set: { walletAddress: null } }
  );
  console.log('Users updated:', result.modifiedCount);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
