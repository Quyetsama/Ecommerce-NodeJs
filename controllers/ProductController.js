const Product = require('../models/Product')
const PAGE_SIZE = 3
const skipObject = { quantily: 0, comments: 0, categories: 0, owner: 0, createdAt: 0, updatedAt: 0, __v: 0 }
// GET /
const index = async (req, res, next) => {
    const page = + req.query.page
    if(page) {
        const countSkip = (page - 1) * PAGE_SIZE
        const products = await Product.find({}, skipObject)
                                .skip(countSkip).limit(PAGE_SIZE)
        return res.status(200).json({ products })
    }
    else {
        const products = await Product.find({}, skipObject)
        return res.status(200).json({ products })
    }
}

// POST /create
const newProduct = async (req, res, next) => {
    if(req.user.shopName === null){
        return res.status(401).json({
            success: false,
            message: 'Bạn phải đăng kí bán hàng'
        })
    }
    
    const { name, image, price, transportFee, categories } = req.body

    const newProduct = await Product.create({ name, image, price, transportFee, categories, owner: req.user._id })
    return res.status(201).json({
        success: true,
        message: 'Thêm sản phẩm thành công',
        newProduct 
    })
}

// GET /test/:id
const getProductByID = async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('categories')
    return res.status(200).json({ product })
}

// GET /:idCategory
const getProductsByCategories = async (req, res, next) => {
    const { idCategory } = req.params
    const page = + req.query.page
    if(page) {
        const countSkip = (page - 1) * PAGE_SIZE
        const products = await Product.find({ categories: idCategory }, skipObject)
                                .skip(countSkip).limit(PAGE_SIZE)
        return res.status(200).json({ products })
    }
    else {
        const products = await Product.find({ categories: idCategory }, skipObject)
        return res.status(200).json({ products })
    }
}

const test = async (req,res, next) => {
    const product = await Product.find({ categories: { $size: 2 } })
    return res.json({ product })
}

// GET /rate
const rateProduct = async (req, res, next) => {
    const { idProduct, star } = req.query
    const product = await Product.updateOne({ _id: idProduct }, { $inc: { 'rate.star': star, 'rate.count': 1 } })
    return res.status(201).json({ product })
}

module.exports = {
    index,
    newProduct,
    getProductByID,
    getProductsByCategories,
    test,
    rateProduct
}