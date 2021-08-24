const DepositModel = require('../../models/DepositModel');
const UserModel = require('../../models/UserModel');
const { newDepositSchema } = require('./joiSchemas');

class DepositController {
    async saveDeposit(user, deposit) {
        const v = newDepositSchema.validate(deposit);
        if (v.error) return { code: 1, message: v.error };

        const r = await this.isRefExists(deposit.id);
        if (r) return { code: 2, message: `invald ref` };

        deposit = new DepositModel(deposit);
        deposit.user = user.id;
        deposit.status = 'pending';
        console.log(deposit);

        deposit.save();

        user = await UserModel.findOne({ email: user.email })
            .then(user => user)
            .catch(err => {
                console.log('Error fetching users ->', err);
                return 0;
            });
        if (user == 0) return { code: 3, message: `An error occurred on the server` };
        user.deposits.push(deposit.id);

        user.save();

        return { code: 0, message: 'OK' };
    }



    async createRef() {
        const ref = `ref_${Math.random() * 1000000}`.replace('.', '');

        const v = await this.isRefExists(ref);

        if (!v) return ref;
        this.createRef();
    }

    //////////////////////
    // UTILITIES
    //////////////////////

    async isRefExists(ref) {
        return await DepositModel.exists({ id: ref })
            .then(data => data)
            .catch(err => {
                console.log(err);
                return null;
            });
    }

    async fetchAll() {
        return await DepositModel.find()
            .then(data => data)
            .catch(err => {
                console.log(err);
                return null;
            });
    }

    async find(depositIds) {

        return await DepositModel.find({ id: depositIds })
            .then(data => data)
            .catch(err => {
                console.log(err);
                return null;
            });
    }
}


module.exports = DepositController;