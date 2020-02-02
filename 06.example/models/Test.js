module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Test', {
        title: {
            type: Sequelize.STRING(255)
        },
        writer: {
            type: Sequelize.STRING(255)
        },
        img: {
            type: Sequelize.STRING(255)
        },
        comment: {
            type: Sequelize.TEXT()
        }
    }, {
        // option
        timestamp: true,
        charset: 'utf8',
        tableName: 'test'
    });
}