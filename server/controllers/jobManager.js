const schedule = require('node-schedule');
const {sendReminder} = require("../controllers/mailHandler");
const User = require('../models/userSchema');
const Statistic = require('../models/statisticSchema');

const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString();
}

const isSameWeek = (date1, date2) => {
    const startOfWeek = (date) => {
        const day = date.getDay(); // 0 is Sunday, 6 is Saturday
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for ISO week (Monday as first day)
        return new Date(date.setDate(diff)).setHours(0, 0, 0, 0); // Start of the week
    };

    const endOfWeek = (date) => {
        const start = new Date(startOfWeek(date));
        return new Date(start.setDate(start.getDate() + 6)).setHours(23, 59, 59, 999); // End of the week
    };
    const start = new Date(startOfWeek(new Date(date1)));
    const end = new Date(endOfWeek(new Date(date1)));

    return date2 >= start && date2 <= end;
};
console.log(new Date())
const jobReminderMail = schedule.scheduleJob({hour: 15, minute: 30}, async function(){

    try {
        const users = await User.find({goal:{ $ne: "no_goal" }});

        if (users) {
            for (const user of users) {
                let statistic = await Statistic.findOne({userId: user._id});
                const timestamp = Date.now();
                const date = new Date(timestamp);
                if (user.goal === 'daily') {
                    if (!isSameDay(date, statistic.lastQuizDate)) {
                        sendReminder(user.email, statistic.streak, statistic.successRate);
                    }
                }
                if (user.goal === 'weekly') {
                    if (!isSameWeek(date, statistic.lastQuizDate)) sendReminder(user.email, statistic.streak, statistic.successRate);
                }
            }
            }
    } catch (error) {
        console.error('Issues occurred during job execution of email reminder')
    }
});

const jobSetBackStreakDaily = schedule.scheduleJob({hour:23, minute:59, second:30}, async function() {
    try {
        const users = await User.find({goal: 'daily' });
        const date = new Date(Date.now());

        if (users) {
            for (const user of users) {
                let statistic = await Statistic.findOne({userId: user._id});
                if (!statistic) continue;
                if (!isSameDay(date, statistic.lastQuizDate)) {
                    statistic.streak = 0;
                    await statistic.save();
                }
            }
        }
    } catch (error) {
        console.error('Issues occured during job execution of setting back the user streak')
    }
});

//weekly job only executed on Sunday
const jobSetBackStreakWeekly = schedule.scheduleJob({day: 0, hour:23, minute:59, second:30}, async function() {
    try {
        const users = await User.find({goal: 'weekly' });
        const date = new Date(Date.now());

        if (users) {
            for (const user of users) {
                let statistic = await Statistic.findOne({userId: user._id});
                if (!isSameWeek(date, statistic.lastQuizDate)) {
                    statistic.streak = 0;
                    await statistic.save();
                }
            }
        }
    } catch (error) {
        console.error('Issues occured during job execution of setting back the user streak')
    }
});


module.exports = {isSameDay, isSameWeek};
