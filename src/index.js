const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const multer = require('multer');

let upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        // cb(undefined, true); /* for accepting */ 
        // cb(undefinded, false); /* for rejecting */
        // cb(new Error('File extension is not valid')); /* for throwing errors if condition not met */
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload a word document only'));
        }
        cb(undefined, true);
    } 
});
const app = express();
const port = process.env.PORT;

// going to automatically parse incoming json to an object
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

app.post('/upload', upload.single('upload'), (req, res) => {
    res.status(200).send();
});

app.listen(port, () => {
    console.log(`Server is up ... on port: ${port}`);
});

const Task = require('./models/task');
const User = require('./models/user');
