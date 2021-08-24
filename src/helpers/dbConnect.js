const mongoose = require('mongoose');


const connect = () => {
    const atlasClient = {
        password: 'may0nna1semay0nna1se',
        db: 'core'
    };


    const uri = `mongodb+srv://root:${atlasClient.password}@cluster0.rinp0.mongodb.net/${atlasClient.db}?retryWrites=true&w=majority`;

    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 1000 })
        .then(val => console.log("Connected to MDB Atlas successfully!"))
        .catch(err => {
            console.log("MDB Atlas could not connect :>>", err);
            connect();
        });
};

module.exports = {
    connect
};