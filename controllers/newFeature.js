const newFeature = require('../models/newFeature')
const aboutUs = require('../models/aboutus')
const { uploadFile } = require('../global/fileUploader')
exports.createFeature = async (req, res) => {
  try {
    const { title, description } = req.body
    const newFeatureData = new newFeature({
      title,
      description,
    })
    await newFeatureData.save()
    return res.status(201).json({ message: 'New Feature created successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.getFeatures = async (req, res) => {
  try {
    const features = await newFeature.find({ isDeleted: false })
    return res.status(200).json({ features })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

// About Us

exports.addAboutUs = async (req, res) => {
  try {
    const { title, description } = req.body
    const aboutUsData = new aboutUs({
      title,
      description,
    })
    if (req.files || req.file) {
      const file = req.files[0] || req.file
      const fileUrl = await uploadFile(file, 'aboutUs')
      if (fileUrl) {
        aboutUsData.image = fileUrl.Location
        await aboutUsData.save()
      }
    }
    await aboutUsData.save()
    return res.status(201).json({ message: 'About Us created successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
exports.getAboutUs = async (req, res) => {
  try {
    const aboutUsData = await aboutUs.find({ isDeleted: false })
    return res.status(200).json({ aboutUsData })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
