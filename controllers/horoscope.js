const { globalImageUploader } = require('../global/fileUploader')
const Admin = require('../models/admin')
const Horoscope = require('../models/horoscope')
const HoroscopeCategory = require('../models/horoscopeCategory')

exports.createHoroscopeCategory = async (req, res) => {
  const { name, description } = req.body
  try {
    let horoscopeCategory = new HoroscopeCategory({
      name,
      description,
    })

    if (req.file || req.files) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(async (file) => {
          const image = await globalImageUploader(
            file,
            horoscopeCategory._id,
            'horoscopeCategory',
          )

          horoscopeCategory.image = image.Location
          await horoscopeCategory.save()
        })
      } else {
        
        const image = await globalImageUploader(
          req.file,
          horoscopeCategory._id,
          'horoscopeCategory',
        )
        horoscopeCategory.image = image.Location
        await horoscopeCategory.save()
      }
    }
    await horoscopeCategory.save()
    return res
      .status(200)
      .json({ message: 'Horoscope category created successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.getHoroscopeCategory = async (req, res) => {
  try {
    const horoscopeCategory = await HoroscopeCategory.find({
      isDeleted: false,
    })
    return res.status(200).json({ horoscopeCategory })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.createHoroscope = async (req, res) => {
  const { title, description, date, time, horoscopeType } = req.body
  try {
    let horoscope = await Horoscope.find({
      date: date,
      horoscopeType: horoscopeType,
      time: time,
    })
    if (horoscope.length > 0) {
      return res.status(400).json({ message: 'Horoscope already exists' })
    }
    horoscope = new Horoscope()
    if (req.files || req.file) {
      if (req.files && req.files.length > 0) {
        req.files.forEach(async (file) => {
          const image = await globalImageUploader(
            file,
            horoscope._id,
            'horoscope',
          )
          horoscope.image.push(image)
        })
      } else {
        const image = await globalImageUploader(
          req.file,
          horoscope._id,
          'horoscope',
        )
        horoscope.image.push(image)
      }
    }
    horoscope.title = title
    horoscope.description = description
    horoscope.date = date
    horoscope.time = time
    horoscope.horoscopeType = horoscopeType
    await horoscope.save()
    return res.status(200).json({ message: 'Horoscope created successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.getHoroscope = async (req, res) => {
  try {
    const horoscope = await Horoscope.find({ isDeleted: false }).sort({
      date: -1,
    })
    console.log(horoscope)
    return res.status(200).json({ horoscope })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.getHoroscopeById = async (req, res) => {
  const id = req.params.id
  try {
    const horoscope = await Horoscope.findById(id)
    return res.status(200).json({ horoscope })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.updateHoroscope = async (req, res) => {
  try {
    const { title, description, date, time } = req.body
    const id = req.params.id
    const horoscope = await Horoscope.findById(id)
    if (!horoscope) {
      return res.status(404).json({ message: 'Horoscope not found' })
    }
    horoscope.title = title
    horoscope.description = description
    if (req.files || req.file) {
      const image = await horoscopeUpload(req.files[0], horoscope._id)
      horoscope.image = image
    }
    horoscope.image = image
    await horoscope.save()
    return res.status(200).json({ message: 'Horoscope updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.deleteHoroscope = async (req, res) => {
  try {
    const id = req.params.id
    let horoscope = await Horoscope.findById(id)
    if (!horoscope) {
      return res.status(404).json({ message: 'Horoscope not found' })
    }
    horoscope.isDeleted = true
    await horoscope.save()
    return res.status(200).json({ message: 'Horoscope deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
