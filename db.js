const mongoose = require('mongoose');
const mongoUrl = 'mongodb://127.0.0.1:27017/IMGPS';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Database connected successfully!');
})
.catch((err) => {
  console.error('❌ Error connecting to database:', err);
});

const db = mongoose.connection;

db.on('disconnected', () => {
  console.log('⚠️ Database disconnected');
});

module.exports = db;
