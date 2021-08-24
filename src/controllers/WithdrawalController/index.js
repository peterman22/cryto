const WithdrawalModel = require('../../models/WithdrawalModel');
const UserModel = require('../../models/UserModel');
const { newWithdrawalSchema } = require('./joiSchemas');

class WithdrawalController {
    async saveWithdrawal(user, Withdrawal) {
        const v = newWithdrawalSchema.validate(Withdrawal);
        if (v.error) return { code: 1, message: v.error };

        const r = await this.isRefExists(Withdrawal.id);
        if (r) return { code: 2, message: `Invalid ref` };

        Withdrawal = new WithdrawalModel(Withdrawal);
        Withdrawal.user = user.id;
        Withdrawal.status = 'pending';
        console.log(Withdrawal);

        Withdrawal.save();

        user = await UserModel.findOne({ email: user.email })
            .then(user => user)
            .catch(err => {
                console.log('Error fetching users ->', err);
                return 0;
            });
        if (user == 0) return { code: 3, message: `An error occurred on the server` };
        user.withdrawals.push(Withdrawal.id);

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
        return await WithdrawalModel.exists({ id: ref })
            .then(data => data)
            .catch(err => {
                console.log(err);
                return null;
            });
    }

    async fetchAll() {
        return await WithdrawalModel.find()
            .then(data => data)
            .catch(err => {
                console.log(err);
                return null;
            });
    }

    async find(WithdrawalIds) {

        return await WithdrawalModel.find({ id: WithdrawalIds })
            .then(data => data)
            .catch(err => {
                console.log(err);
                return null;
            });
    }
}


module.exports = WithdrawalController;