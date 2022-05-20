const Notify = require('../models/Notify')
const User = require('../models/User')
const admin = require("firebase-admin");
const serviceAccount = require("../../ecomerce-push-notification-firebase-adminsdk-ccr7z-ee3c07b946.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const index = async (req, res, next) => {

    const { customData, id, ad, subTitle, title, body, image, color } = req.body

    // https://stackoverflow.com/questions/70880439/how-do-i-merge-arrays-from-multiple-documents-without-duplicates-in-mongodb-aggr
    const users = await User.aggregate([
        {
            $unwind: "$tokenDevices"
        },
        {
            $group: {
                _id: null,
                token: {
                    $addToSet: "$tokenDevices"
                }
            }
        }
    ])

    // console.log(users[0].token.length)

    // const token = [
    //     'fEyRMTzVRiCTzDnlNd4O4W:APA91bGcw0fzF5lhxpgotzyPi6AxXSzE5oWKRAopppLZMUicaYItFvMuFN9nxp_4zOnWL4DwuefFVfyaFgLFBFnc3jthTSSwFXwLjfGWRv_fBdxnvc1DL0a4nABXoTxhxIuYCY3Kl-WZ'
    // ]
    

    if(users[0]?.token?.length > 0) {
        const msg = await admin.messaging().sendToDevice(
            users[0].token, 
            {
                data: {
                    // customData: customData,
                    // id: id,
                    // ad: ad,
                    title,
                    subTitle,
                    body, 
                    image,
                    color
                }
            },
            {
                priority: 'high',
            }
        )
    
        return res.status(200).json({
            success: true,
            message: msg
        })
    }

    return res.status(200).json({
            success: false
        })
}

const sendtoUser = async (tokenDevice, data) => {
    const msg = await admin.messaging().sendToDevice(
        tokenDevice, 
        {
            data
        },
        {
            priority: 'high',
        }
    )

    return msg
}

const getNotify = async (req, res, next) => {
    const notyfies = await Notify.find({
        user: req.user._id
    }).sort({ createdAt: -1 })

    const countNotify = await Notify.countDocuments({
        user: req.user._id,
        read: false
    })

    return res.status(200).json({
        success: true,
        data: notyfies,
        count: countNotify
    })
}

const readNotify = async (req, res, next) => {

    const { _id } = req.body

    await Notify.updateOne(
        { 
            _id: _id,
            user: req.user._id
        },
        { read: true }
    )

    return res.status(200).json({
        success: true
    })
}

const countNotify = async (req, res, next) => {
    const notify = await Notify.countDocuments(
        { 
            user: req.user._id,
            read: false
        }
    )

    return res.status(200).json({
        success: true,
        count: notify
    })
}

module.exports = {
    index,
    getNotify,
    sendtoUser,
    readNotify,
    countNotify
}