var express = require('express');
var router = express.Router();

const AdminController = require('../src/controllers/AdminController');
const DepositController = require('../src/controllers/DepositController');

const adminController = new AdminController();
const depositController = new DepositController();

const auth = require('../src/middleware/auth');
const admin = require('../src/middleware/isAdmin');

/* WHOAMI */
router.get('/whoami', auth, admin, async (req, res) => {
    const r = await adminController.whomai(req.user.id);

    switch (r.code) {
        case 0:
            return res.send({ data: r.message });
        case 1:
            return res.status(500).send({ data: r.message });

        default:
            break;
    }
});


/* GET ALL USERS */
router.get('/users', auth, admin, async (req, res) => {
    const r = await adminController.getAllUsers();

    switch (r.code) {
        case 0:
            return res.send({ data: r.message });
        case 1:
            return res.status(500).send({ message: r.message });

        default:
            break;
    }
});


/* CREATE NEW ADMIN */
router.post('/', async (req, res) => {
    const r = await adminController.createAdmin(req.body);
    switch (r.code) {
        case 0:
            return res.send({ message: r.message });
        case 1:
            return res.status(400).send({ message: r.message });
        case 2:
            return res.status(409).send({ message: r.message });
        case 3:
            return res.status(500).send({ message: r.message });
    }
});

/* SIGN ADMIN IN */
router.post('/login', async (req, res) => {
    const r = await adminController.login(req.body, req, res);
    switch (r.code) {
        case 0:
            return res.send({ message: r.message });
        case 1:
            return res.status(400).send({ message: r.message });
        case 2:
            return res.status(406).send({ message: r.message });
        case 3:
            return res.status(406).send({ message: r.message });
    }
});

/* APPROVE DEPOSITS */
router.post('/deposits/approve', auth, admin, async (req, res) => {
    if (!req.body.deposits) return res.status(406).send({ message: `\`deposits\` field is required` });

    const r = await adminController.approveDeposits(req.body.deposits);

    switch (r.code) {
        case 0:
            return res.send({ message: r.message });
        case 1:
            return res.status(406).send({ message: r.message });
        case 2:
            return res.status(500).send({ message: r.message });

        default:
            break;
    }
});

/* APPROVE WITHDRAWALS */
router.post('/withdrawals/approve', auth, admin, async (req, res) => {
    if (!req.body.withdrawals) return res.status(406).send({ message: `\`withdrawals\` field is required` });

    const r = await adminController.approveWithdrawals(req.body.withdrawals);

    switch (r.code) {
        case 0:
            return res.send({ message: r.message });
        case 1:
            return res.status(406).send({ message: r.message });
        case 2:
            return res.status(500).send({ message: r.message });

        default:
            break;
    }
});

/* GET ALL DEPOSITS */
router.get('/deposits', auth, admin, async (req, res) => {
    const r = await adminController.getAllDeposits();

    switch (r.code) {
        case 0:
            return res.send({ data: r.message });
        case 1:
            return res.status(500).send({ data: r.message });

        default:
            break;
    }
});

/* GET ALL WITHDRAWALS */
router.get('/withdrawals', auth, admin, async (req, res) => {
    const r = await adminController.getAllWithdrawals();

    switch (r.code) {
        case 0:
            return res.send({ data: r.message });
        case 1:
            return res.status(500).send({ data: r.message });

        default:
            break;
    }
});

/* DELETE USERS */
router.delete('/users', auth, admin, async (req, res, next) => {
    if (!req.body.users) return res.status(406).send({ message: `\`users\` field is required` });

    const r = await adminController.deleteUsers(req.body.users);

    switch (r.code) {
        case 0:
            return res.send({ message: r.message });
        case 1:
            return res.status(500).send({ message: r.message });

        default:
            break;
    }
});

/* UPDATE USER */
router.put('/users', auth, admin, async (req, res) => {
    const r = await adminController.updateUser(req.body);

    switch (r.code) {
        case 0:
            return res.send({ message: r.message });

        default:
            break;
    }
});

/* LOGOUT */
router.get('/logout', async (req, res) => {
    console.log('Logout');
    res.clearCookie('auth');
    res.end();
});

/* CHANGE PASSWORD */
router.post('/change-password', auth, admin, async (req, res) => {
    if (!req.body.old || !req.body.new) return res.status(406).send({ message: `\`old\` and \`new\` fields are required` });

    const r = await adminController.changePassword(req.user.id, req.body.old, req.body.new);
    switch (r.code) {
        case 0:
            return res.send({ message: r.message });
        case 1:
            return res.status(500).send({ message: r.message });
        case 2:
            return res.status(406).send({ message: r.message });

        default:
            break;
    }
});

module.exports = router;