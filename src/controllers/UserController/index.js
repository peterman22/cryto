const crypt = require('../../helpers/crypt');
const UserModel = require('../../models/UserModel');
const { newUserSchema, existingUserSchema, updateProfileImageSchema } = require('./joiSchemas');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { setTokenCookie } = require('../../helpers/cookies');
const DepositController = require('../DepositController');
const WithdrawalController = require('../WithdrawalController');

const depositController = new DepositController();
const withdrawalController = new WithdrawalController();

class UserController {
    async changePassword(id, oldPassword, newPassword) {

        return await UserModel.findOne({ _id: id })
            .then(async (data) => {
                const h = await crypt.compare(oldPassword, data.pass);
                if (!h) return { code: 2, message: `Passwords do not match!` };

                const pass = await crypt.hash(newPassword);
                if (!pass) return { code: 1, message: `An error occurred on the server` };


                data.pass = pass;
                data.save();
                return { code: 0, message: `Success!` };
            })
            .catch(err => {
                console.log(err);
                return { code: 1, messae: `An error occurred` };
            });
    }

    async getUserDataClean(id) {
        return await UserModel.findOne({ _id: id })
            .then(async (data) => {
                const u = this.cleanUser(data._doc);
                u.deposits = await depositController.find(u.deposits);
                u.withdrawals = await withdrawalController.find(u.withdrawals);

                return u;
            })
            .catch(err => {
                console.log('Error ', err);
                return null;
            });
    }

    async updateProfilePicture(user) {
        const v = updateProfileImageSchema.validate(user);
        if (v.error) return { code: 1, message: v.error };

        await UserModel.findOne({ email: user.email }, (err, doc) => {
            doc.image = user.image;
            doc.save();
        });

        return { code: 0, message: `Profile picture updated successfully` };
    }

    async login(user, req, res) {
        // is user object valid?
        const v = existingUserSchema.validate(user);
        if (v.error) return { code: 1, message: v.error };

        // does user exist?
        const possibleUser = await this.fetchOne(user.email);
        if (!possibleUser) return { code: 2, message: `The email or password is incorrect` };

        // since user exists, do passwords match?
        const p = await crypt.compare(user.password, possibleUser.pass);
        if (!p) return { code: 2, message: `The email or password is incorrect` };

        // since passwords match, create tokens and push back
        const accessToken = jwt.sign({
            id: possibleUser._id, email: possibleUser.email, role: `user`
        },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );
        setTokenCookie(accessToken, req, res);

        user = { ...possibleUser['_doc'] };

        // each login event should be logged
        // the 'login' field is an array of unmarshalled JSON
        const logins = JSON.parse(user.logins || '[]');
        logins.push({
            timestamp: new Date(),
            ip: req.ip,
            summary: 'genuine'
        });
        user.logins = JSON.stringify(logins);
        possibleUser.logins = JSON.stringify(logins);
        // save this user before deleting fields
        possibleUser.save();

        delete user['pass'];
        delete user['_id'];
        delete user['__v'];
        user['token'] = accessToken;
        return { code: 0, message: user };

    }

    async createUser(user) {
        // is user object valid?
        const v = newUserSchema.validate(user);
        if (v.error) return { code: 1, message: v.error };

        // does user exist?
        const possibleUser = await this.doesUserExist(user.email);

        if (possibleUser === null) return { code: 4, message: `An error occurred` };
        if (possibleUser) return { code: 2, message: `A user account is already registered with this email` };

        // hash password
        const pass = await crypt.hash(user.password);
        if (!pass) return { code: 3, message: `An error occurred` };

        // save user
        delete user.password;
        user.pass = pass;
        user.profits = 0;

        user = new UserModel(user);
        user.save();

        return ({ code: 0, message: `User account created successfully` });
    }

    ////////////////////////
    // UTILITIES
    ///////////////////////
    fetchAll() {
        return UserModel.find()
            .then(user => user)
            .catch(err => {
                console.log('Error fetching users ->', err);
                return 0;
            });
    }

    cleanUser(user) {
        delete user['pass'];
        delete user['_id'];
        delete user['__v'];

        return user;
    }

    async fetchOne(email) {
        return await UserModel.findOne({ email })
            .then(user => user)
            .catch(err => {
                console.log('Error fetching user ->', err);
                return 0;
            });
    }

    async doesUserExist(email) {
        return await UserModel.exists({ email })
            .then(data => data)
            .catch(err => {
                console.log(err);
                return null;
            });
    }
}

module.exports = UserController;