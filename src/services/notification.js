const {
  Notification,
} = require('../models');
const { asyncForEach } = require('../helpers');

const pushNotification = (listener, notification) => {
  // const socket = io.sockets.connected[socketId];
  // socket.emit('notification', data);
  io.sockets.emit(`notify_user_${listener}`, notification);

  // Send notify socket.io;
  // Send notify WPA
};

const NotifyService = {
  // Push notification
  push: async ({
    sender,
    listeners,
    type,
    role,
  }) => {
    const listListeners = Array.isArray(listeners) ? listeners : [listeners];

    await asyncForEach(listListeners, async (listener) => {
      const message = '';
      const senderData = {};

      // custom message and data here

      const notification = await Notification.create({
        sender,
        listener,
        type,
        message,
        role,
      });

      pushNotification(listener, {
        _id: notification._id,
        sender: senderData,
        message,
        type,
        createdAt: new Date(),
      });
    });
  },
};

module.exports = NotifyService;
