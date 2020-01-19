// CRUD operations 

/* const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient
const ObjectId = mongodb.ObjectID */

const {MongoClient, ObjectId} = require('mongodb');

/* const id = new ObjectId();
console.log(id)
console.log(id.getTimestamp())
console.log(id.id.length)
console.log(id.toHexString().length) */

const connectURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database');
    }

    const db = client.db(databaseName);
    // -----------------------------------------create-----------------------------------
    /* db.collection('users').insertOne({
        name: 'Abhishek',
        age: 26
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert user');
        }

        console.log(result.ops);
    }); */

    /* db.collection('users').insertOne({
        _id: id,
        name: 'Anuj',
        age: 25
    }, (error, result) => {
        if (error) {
            return console.log('Unable to insert user');
        }

        console.log(result.ops);
    }); */

    /* db.collection('users').insertMany([
        {
            name: 'Jen',
            age: 27
        },{
            name: 'Gunther',
            age: 28
        }
    ], (error,result) => {
        if (error) {
            return console.log('Unable to insert user');
        }

        console.log(result.ops);
    }); */

    /* db.collection('tasks').insertMany([
        {
            description: 'Buy grocery',
            completed: false
        },
        {
            description: 'Cook food',
            completed: false
        },
        {
            description: 'Do the laundry',
            completed: true
        }
    ], (error, result) => {
        if (error) {
            return console.log('Unable to insert data');
        }

        console.log(result.ops);
    }); */
    // ----------------------------------------------------------------------------------
    // -----------------------------------------read-------------------------------------

    /* db.collection('users').findOne({name: 'Jen'}, (error, user) => {
        if (error) {
            return console.log('Unable to fetch');
        }

        console.log(user);
    });

    db.collection('users').findOne({name: 'Jen', age: 1}, (error, user) => {
        if (error) {
            return console.log('Unable to fetch');
        }

        console.log(user);
    }); */

    /* db.collection('users').findOne({_id: '5dff29ab3059d616bc894d88'}, (error, user) => {
        if (error) {
            return console.log('Unable to fetch');
        }

        console.log(user);
    }); */

    /* db.collection('users').findOne({_id: new ObjectId('5dff29ab3059d616bc894d88')}, (error, user) => {
        if (error) {
            return console.log('Unable to fetch');
        }

        console.log(user);
    }); */
    // returns cursor not data
    // db.collection('users').find({age: 27})
    /* db.collection('users').find({age: 27}).toArray((error, users) => {

        if (error) {
            return console.log('Unable to fetch');
        }

        console.log(users);
    }); */

    /* db.collection('users').find({age: 27}).count((error, users_count) => {

        if (error) {
            return console.log('Unable to fetch');
        }

        console.log(users_count);
    }); */

    /* db.collection('tasks').findOne({_id: new ObjectId("5dff2b56d01f6905a0aeb0fe")}, (error, task) =>{
        if (error) {
            return console.log('Unable to fetch');
        }

        console.log(task);
    });

    db.collection('tasks').find({completed: false}).toArray((error, incompleted_tasks) => {
        if (error) {
            return console.log('Unable to fetch');
        }

        console.log(incompleted_tasks);
    }); */

    // ----------------------------------------------------------------------------------
    // ------------------------------------update----------------------------------------

    // promise implemented

    /* db.collection('users').updateOne({_id: new ObjectId("5dff2584e07c793b5c26a752")}, {
        $set: {
            name: 'Mike'
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    }); */

    /* db.collection('users').updateOne({_id: new ObjectId("5dff2584e07c793b5c26a752")}, {
        $inc: {
            age: 1
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    }); */

   /*  db.collection('tasks').updateMany({completed: false}, {
        $set: {
            completed: true
        }
    }).then((result) => {
        console.log(result.modifiedCount);
    }).catch((error) => {
        console.log(error);
    }); */

    // -----------------------------------delete-----------------------------------------

    /* db.collection('users').deleteMany({age: 27}).then((result) => {
        console.log(result.deletedCount);
    }).catch((error) => {
        console.log(error);
    }); */

    db.collection('tasks').deleteOne({
        description: 'Do the laundry'
    }).then((result) => {
        console.log(result.deletedCount);
    }).catch((error) => {
        console.log(error);
    });

    // ----------------------------------------------------------------------------------
});