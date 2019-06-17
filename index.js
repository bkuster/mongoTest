const mongoose = require('mongoose');

function runTest() {
  const petSchema = new mongoose.Schema({
    name: String,
    type: {
      type: String, enum: ['dog', 'cat'],
    },
  });
  const Pet = new mongoose.model('Pet', petSchema);
  function findDog() {
    return Pet.findOne({ type: 'dog' }).then();
  }
  const bingo = new Pet({ name: 'bingo', type: 'dog' });
  return bingo.save()
    .then(() => findDog())
    .then((candidate) => {
      if (candidate.name === 'bingo') {
        console.log('found bingo!');
      } else {
        console.error('could not find bingo');
      }
    })
    .then(() => bingo.remove())
    .then(() => findDog())
    .then((candidate) => {
      if (candidate === null) {
        console.log('success!');
      } else {
        console.error('bingo is still here...');
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

function testMongo(host) {
  mongoose.connect(`mongodb://${host}/test`, { useNewUrlParser: true });

  const db = mongoose.connection;
  db.on('error', (err) => {
    console.error('connection error');
    console.error(err);
    process.exit(1);
  });

  db.once('open', () => {
    runTest().then(() => { db.close(); });
  });
}

module.exports = testMongo;
