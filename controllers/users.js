const userModel = require('../models/users')
const lodash = require('lodash')
const {
  hashGenerator,
  otpGenerator,
  tokenGenerator,
  tokenVerifier,
  hashVerifier,
} = require('../global/global')
const { uploadFile } = require('../global/fileUploader')
const Product = require('../models/product')
exports.signup = async (req, res) => {
  const { mobileNumber, countryCode } = req.body
  try {
    let user = await userModel.findOne({ mobileNumber: mobileNumber })
    if (!user) {
      user = new userModel({ mobileNumber, countryCode })
      user = await user.save()
    }

    let otp = otpGenerator()
    let sentotp = otp;
    let otpExpiration = new Date(new Date().getTime() + 5 * 60 * 1000)
    otp = await hashGenerator(otp.toString())
    await userModel.updateOne(
      { _id: user._id },
      { $set: { otp, otpExpiration } },
      { new: true },
    )

    return res.status(200).json({ message: 'OTP sent successfully',sentotp })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.authenticate = async (req, res) => {
  let { mobileNumber, countryCode, otp } = req.body
  try {
    let user = await userModel.findOne({
      mobileNumber,
      countryCode,
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (user.otpExpiration.getTime() < new Date().getTime()) {
      return res.status(401).json({ message: 'OTP expired' })
    }
    if (!hashVerifier(otp, user.otp)) {
      return res.status(401).json({ message: 'OTP is incorrect' })
    }
    let token = tokenGenerator({ mobileNumber, countryCode, userId: user._id })
    return res
      .status(200)
      .json({ message: 'User authenticated successfully', token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.veryfyToken = async (req, res) => {
  try {
    let user = await userModel.findOne({
      _id: req.user.userId,
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'Token verified successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.updateProfile = async (req, res) => {
  const { firstName, lastName, email, gender, dateOfBirth, address } = req.body
  try {
    let user = await userModel.findOne({
      _id: req.user.userId,
    })
    const files = req.files || req.file
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    if (files) {
      const file = await uploadFile(files[0], user._id)
      user.profileImg = file.Location
    }
    user.firstName = firstName
    user.lastName = lastName
    user.email = email
    user.gender = gender
    user.dateOfBirth = dateOfBirth ? dateOfBirth.toString() : dateOfBirth
    user.address = address
    user = await user.save()

    return res.status(200).json({ message: 'User updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.getProfile = async (req, res) => {
  try {
    let user = await userModel.findOne({
      _id: req.user.userId,
      isDeleted: false,
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    return res.status(200).json({ message: 'User fetched successfully', user })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

// Add product to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const userData = await userModel.findOne({ _id: req.user.userId })
    const wishlist = userData.wishlist

    if (wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' })
    }

    await userModel.updateOne(
      { _id: req.user.userId },
      { $push: { wishlist: productId } },
    )
    return res.status(200).json({ message: 'Product added to wishlist' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

// Remove product from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    const { wishlist } = await userModel.findOne({ _id: req.user.userId })
    if (!wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product not in wishlist' })
    }
    await userModel.updateOne(
      { _id: req.user.userId },
      { $pull: { wishlist: productId } },
    )
    return res.status(200).json({ message: 'Product removed from wishlist' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const {wishlist} = await userModel
      .findOne({ _id: req.user.userId }, 'wishlist')
    let wishlistData =   wishlist.map(async (product) => {
        const productData = await Product.findOne({ _id: product })
       
        return productData
      })
   wishlistData = await Promise.all(wishlistData) 
   
    return res
      .status(200)
      .json({ message: 'Wishlist fetched successfully', wishlistData  })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find()
    return res.status(200).json({ message: 'Users fetched successfully', users })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const {isDeleted} = req.body
    let user = await userModel.findOne({ _id: req.params.id })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    isDeleted ? (user.isDeleted = true) : (user.isDeleted = false)
    isDeleted ? user.deletedAt = new Date() : user.deletedAt = null
    await user.save()
    return res.status(200).json({ message: 'User update successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}