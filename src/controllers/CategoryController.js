const Category = require('../models/Category')



const index = async (req, res, next) => {
    const categories = await Category.find({})
    return res.status(200).json({ categories })
}

const newCategory = async (req, res, next) => {
    const newCategory = await Category.create(req.body)
    return res.status(201).json({newCategory})
}

module.exports = {
    index,
    newCategory
}