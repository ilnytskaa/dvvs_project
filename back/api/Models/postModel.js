const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:1111@localhost:5432/dvvs_db', {
    dialect: 'postgres',
});

const Post = sequelize.define('post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

module.exports = { Post, sequelize };

sequelize.sync({ force: true }) // force: true перезавантажить таблицю, якщо вона існує
    .then(() => {
        console.log('Database & table created!');
    })
    .catch(err => console.error(err));
