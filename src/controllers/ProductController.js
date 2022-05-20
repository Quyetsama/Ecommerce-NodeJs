const Product = require('../models/Product')
const User = require('../models/User')
const Category = require('../models/Category')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')
const { isEmpty } = require('lodash')
const PAGE_SIZE = 3
const skipObject = { description: 0, classify: 0, quantily: 0, comments: 0, categories: 0, owner: 0, createdAt: 0, updatedAt: 0, __v: 0 }
// GET /
const index = async (req, res, next) => {
    const page = + req.query.page
    if(page) {
        const countSkip = (page - 1) * PAGE_SIZE
        const products = await Product.find({}, {...skipObject, image: { $slice: 1 }})
                                .skip(countSkip).limit(PAGE_SIZE)
        return res.status(200).json({ products })
    }
    else {
        const products = await Product.find({}, {...skipObject, image: { $slice: 1 }})
        return res.status(200).json({ products })
    }
}

// POST /create
const newProduct = async (req, res, next) => {
    const { name, des, image, classify, category, price, quantity, transportfee } = req.body
    if(req.user.shopName === null){
        return res.status(401).json({
            success: false,
            message: 'Bạn phải đăng kí bán hàng'
        })
    }

    const listImage = []
    image.map((item, index) => {
        const nameImage = `${ uuidv4() }.png`
        fs.writeFile(`./src/publics/image/${ nameImage }`, item + '', 'base64', function(err) {
            // console.log(err);
            err && console.log(err)
        })
        listImage.push(nameImage)
    })

    const newProduct = await Product.create({
        name: name,
        description: des,
        image: listImage,
        categories: category._id,
        classify: !isEmpty(classify) ? classify : null,
        price: price,
        quantity: quantity,
        transportFee: transportfee,
        owner:req.user._id
    })

    return res.status(201).json({
        success: true,
        message: 'Thêm sản phẩm thành công',
        newProduct 
    })
}

// GET /detail/:id
const getProductByID = async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('categories').lean()

    if(req.user) {
        const user = await User.findOne({
            _id: req.user._id,
            favorite: product._id
        })

        if(user) {
            return res.status(200).json({...product, favorite: true})
        }
        
    }
    

    return res.status(200).json({...product, favorite: false})
}

// GET /:idCategory
const getProductsByCategories = async (req, res, next) => {
    const { idCategory } = req.params
    const page = + req.query.page
    if(page) {
        const countSkip = (page - 1) * PAGE_SIZE
        const products = await Product.find({ categories: idCategory }, {...skipObject, image: { $slice: 1 }})
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

const searchProduct = async (req, res, next) => {

    const { name } = req.query

    const productFound = await Product.aggregate([
        {$match: { name: { $regex : name, $options: 'i' } }},
        {$project: { _id: 1, name: 1, image: { $first: '$image' } }}
    ]).skip(0).limit(20)

    return res.status(200).json({
        success: true,
        data: productFound
    })
}

const suggestProduct = async (req, res, next) => {

    const products = await Product.aggregate([
        {$project: { _id: 1, name: 1, image: { $first: '$image' } }},
        {$sample: {size: 5}}
    ])

    return res.status(200).json({
        success: true,
        data: products
    })
}

const getProductRelated = async (req, res, next) => {
    const { page } = req.query
    const match = handleMatch(req)

    if(+page) {
        const countSkip = (+page - 1) * PAGE_SIZE
        const productsFound = await Product.aggregate([
            {
                $match: match
            },
            {$project: { _id: 1, name: 1, image: { $first: '$image' }, price: 1, sold: 1 }}
        ]).skip(countSkip).limit(PAGE_SIZE)
        return res.status(200).json({ 
            success: true,
            data: productsFound
        })
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'Query error!'
        })
    }
}

const getProductSelling = async (req, res, next) => {
    const { page } = req.query
    const match = handleMatch(req)

    if(+page) {
        const countSkip = (+page - 1) * PAGE_SIZE
        const productsFound = await Product.aggregate([
            {
                $match: match
            },
            {$project: { _id: 1, name: 1, image: { $first: '$image' }, price: 1, sold: 1 }}
        ]).sort({ sold: -1 }).skip(countSkip).limit(PAGE_SIZE)
        return res.status(200).json({ 
            success: true,
            data: productsFound
        })
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'Query error!'
        })
    }
}

const getProductPriceUpDown = async (req, res, next) => {
    const { page, sort } = req.query
    const match = handleMatch(req)

    if(+page) {
        const countSkip = (+page - 1) * PAGE_SIZE
        const productsFound = await Product.aggregate([
            {
                $match: match
            },
            {$project: { _id: 1, name: 1, image: { $first: '$image' }, price: 1, sold: 1 }}
        ]).sort({ price: sort === 'desc' ? -1 : 1 }).skip(countSkip).limit(PAGE_SIZE)
        
        return res.status(200).json({ 
            success: true,
            data: productsFound
        })
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'Query error!'
        })
    }
}

const searchFilter = async (req, res, next) => {
    const { page, sort } = req.query
    const match = handleMatch(req)

    if(+page) {
        const countSkip = (+page - 1) * PAGE_SIZE
        const productsFound = await Product.aggregate([
            {
                $match: match
            },
            {$project: { _id: 1, name: 1, image: { $first: '$image' }, price: 1, sold: 1, categories: 1 }}
        ]).sort({ price: sort === 'desc' ? -1 : 1 }).skip(countSkip).limit(PAGE_SIZE)
        
        return res.status(200).json({ 
            success: true,
            data: productsFound
        })
    }
    else {
        return res.status(400).json({
            success: false,
            message: 'Query error!'
        })
    }
    // return res.status(200).json({
    //     success: false,
    //     query: findArgs
    // })
}

const handleMatch = (req) => {
    const baseQuery = ['name', 'page', 'sort', 'category']
    const findArgs = {}
    for(const key in req.query) {
        // console.log(key)
        if(baseQuery.includes(key)) continue
        findArgs[key] = JSON.parse(req.query[key])
    }

    // console.log(findArgs)

    const match = {
        name: { $regex : req.query.name, $options: 'i' },
        ...(findArgs.filters?.price?.max > 0 && {price: { $gte: +findArgs.filters?.price.min, $lte: +findArgs.filters?.price.max }}),
        ...(findArgs.filters?.category !== '' && {categories: ObjectId(findArgs.filters?.category)})
    }

    return match
}

const demo = async (req, res, next) => {

    // const productsFound = await Product.findById('61f0bb52b24e768ba000b820')

    const productsFound = await Product.aggregate([
        {
            $match: {
                _id: ObjectId('61f0bb52b24e768ba000b820')
            }
        },
        {$project: { _id: 1, name: 1, image: { $first: '$image' }, price: 1, sold: 1, categories: 1 }}
    ])
    
    return res.status(200).json({ 
        success: true,
        data: productsFound
    })

    return res.status(200).json({
        success: true
    })
}


module.exports = {
    index,
    newProduct,
    getProductByID,
    getProductsByCategories,
    test,
    rateProduct,
    searchProduct,
    suggestProduct,
    getProductRelated,
    getProductSelling,
    getProductPriceUpDown,
    searchFilter,
    demo
}