/* eslint-disable no-await-in-loop */
const faker = require('faker');
const { User } = require('../models');

const fakeUsers = async () => {
  try {
    await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@gmail.com',
      password: 1,
      avatar: faker.internet.avatar(),
      isVerified: true,
    });

    for (let i = 0; i < 20; i += 1) {
      await User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: 1,
        avatar: faker.internet.avatar(),
        isVerified: true,
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

module.exports = fakeUsers;
