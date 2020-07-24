const mongoose = require("mongoose");
const User = require("../models/User");

mongoose.Promise = global.Promise;

module.exports = (settings) => {
  mongoose.connect(settings.db);
  let db = mongoose.connection;

  db.once("open", (err) => {
    mongoose.connection.db
      .admin()
      .command(
        { setParameter: 1, internalQueryExecMaxBlockingSortBytes: 335544320 },
        function (err, result) {
          console.log(result);
        }
      );

    if (err) {
      throw err;
    }
    console.log("MongoDB ready!");
    User.seedAdminUser();
  });
  db.on("error", (err) => console.log(`Database error: ${err}`));
};
