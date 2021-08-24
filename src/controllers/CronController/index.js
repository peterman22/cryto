const DepositController = require('../DepositController');
const UserController = require('../UserController');
const dc = new DepositController();
const uc = new UserController();
const cron = require('node-cron');


class CronController {
    async startDepositsUpdateCronJob() {
        cron.schedule('* 1 * * *', async () => {
            console.log('Starting DepositsUpdate cron jobs');
            console.time('S');
            await this.updateDeposits()
            console.timeEnd('S');
        });
    }

    async updateDeposits() {
        this.deposits = await dc.fetchAll();
        if (this.deposits == null) return;

        const now = new Date().now();

        thsi.deposits.forEach(async (e) => {
            const user = await uc.getUserDataClean(e.user);

            switch (e.plan) {
                case 10:
                    user.profits += (10 * e.amount)/100;
                    break;
                case 15:
                    user.profits += (15 * e.amount)/100;
                case 25:
                    user.profits += (25 * e.amount)/100;
                default:
                    break;
            }
            user.save();
        });
    }
}

function monthDiff(d1, d2) {
    let months;

    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();

    return months <= 0 ? 0 : months;
}

module.exports = CronController;