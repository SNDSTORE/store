const mongoose = require('mongoose');

mongoose
  .connect("mongodb+srv://sndstore136:qeI288DUGBqzD8hn@snd-store.gfhsz.mongodb.net/all-data?retryWrites=true&w=majority&appName=SND-Store", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

module.exports = mongoose;
