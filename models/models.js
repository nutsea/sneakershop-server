const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const Item = sequelize.define('items', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    code: {type: DataTypes.STRING, allowNull: false},
    brand: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    price: {type: DataTypes.FLOAT, allowNull: false},
    sale: {type: DataTypes.FLOAT},
    count: {type: DataTypes.INTEGER},
    size: {type: DataTypes.FLOAT, allowNull: false},
    size_type: {type: DataTypes.STRING, allowNull: false},
    category: {type: DataTypes.STRING, allowNull: false},
    model: {type: DataTypes.STRING},
    color: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING}
})

const Image = sequelize.define('images', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false}
})

Item.hasMany(Image, {foreignKey: 'item_id'})
Image.belongsTo(Item, {foreignKey: 'item_id'})

module.exports = {
    Item,
    Image
}