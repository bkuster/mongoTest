#!/usr/bin/env node
const testMongo = require('./index');

if (process.argv.length < 3) {
  console.error('missing host');
}

const host = process.argv[2];
testMongo(host);
