const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middlewares/auth');
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');
const multer = require('multer');
const sharp = require('sharp');

router.post('/users', async (req, res) =>{
    const user = new User(req.body);
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }catch (e){
        res.status(400).send(e);
    }
});

router.post('/user/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        // res.status(200).send({user: user.getPublicProfile(), token});
        res.status(200).send({user, token});
    }catch(e){
        // console.log(e);
        res.status(400).send({ message: e.message });
    }
});

router.post('/user/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.sendStatus(200);
    }catch(e){
        res.sendStatus(500);
    }
});

router.post('/user/logout/all', auth, async (req, res) => {
    try{
        req.user.tokens = [];
        await req.user.save();
        res.sendStatus(200);
    }catch(e){
        res.sendStatus(500);
    }
});

/* router.get('/users', async (req, res) => {
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }catch(e){
        res.status(500).send(e);
    }
}); */

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/user/me', auth,  async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];

/*     if (!req.params.id.match(/[0-9a-zA-Z]{24}$/)) {
        return res.sendStatus(400);
    } */

    const isValidUpdate = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidUpdate) {
        return res.status(400).send({error: 'invalid update'});
    }

    try{
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        res.status(200).send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
});

router.delete('/user/me', auth, async (req, res) => {
    try{
        await req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name);
        res.status(200).send(req.user);
    }catch(e){
        res.status(500).send(e);
    }
});

let upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.jpg|jpeg|png$/)) {
            return cb(new Error('Please upload image[jpg, jpeg, png] only'))
        }
        cb(undefined, true);
    }
});

router.post('/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.sendStatus(200);
}, (error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete('/user/me/avatar', auth, async (req,res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.sendStatus(200);
});

router.get('/user/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if (!user || !user.avatar) {
            throw new Error;
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    }catch(e){
        res.sendStatus(400);
    }
})

module.exports = router;