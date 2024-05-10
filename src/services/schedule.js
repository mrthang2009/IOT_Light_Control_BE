const schedule = require('node-schedule');

const { asyncForEach } = require('../helpers');
const { Event, User, Notification } = require('../models');
const NotifyService = require('../services/notification');

module.exports = {
  start() {
    // eslint-disable-next-line no-console
    console.log(`${new Date()}: Cronjob has been created`);

    schedule.scheduleJob('0 0 * * *', async () => {
      // eslint-disable-next-line no-console
      console.log(`${new Date()}: Cronjob Run`);

      const date = new Date();

      const events = await Event
        .find({
          type: 'BIRTHDAY',
          date: {
            day: date.getDate(),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
          },
        })
        .select('friend')
        .populate('friend', 'firstName lastName avatar birthday')
        .lean();

      await asyncForEach(events, async (event) => {
        const users = await User
          .find({ friend: event.friend._id })
          .select('user')
          .populate('user', 'deviceToken deviceType isBlocked')
          .lean();

        await asyncForEach(users, async (user) => {
          const message = `Aujourd'hui c'est l'anniversaire de ${event.friend.firstName} ${event.friend.lastName}, donnez-lui un cadeau.`;

          await Notification.create({
            receiver: user._id,
            friend: event.friend._id,
            type: 'BIRTHDAY',
            message,
          });

          // Push notification
          NotifyService.pushNotification({
            deviceToken: user.deviceToken,
            deviceType: user.deviceType,
            message,
            data: {
              type: 'BIRTHDAY',
              friend: event.friend,
            },
          });
        });
      });
    });
  },
};
