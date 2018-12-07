"use strict";
const faker = require('faker');
const moment = require('moment');

module.exports = {
  up: (queryInterface, Sequelize) => {

    let tasks = [];

    for (let index = 0; index < 100; index++) {
      tasks.push(
        {
          title: faker.name.jobTitle(),
          cost: faker.random.number(),
          status: faker.random.number({ min: 1, max: 5 }),
          category: faker.random.number({ min: 1, max: 2 }),
          people: faker.random.number({ min: 1, max: 6 }),
          time: moment().format("YYYY-MM-DD"),
          description: faker.name.jobDescriptor(),
          owner: faker.random.number({ min: 106, max: 106 }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      );
    }

    return queryInterface.bulkInsert("tasks", tasks, {});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("tasks", null, {});
  },
};
