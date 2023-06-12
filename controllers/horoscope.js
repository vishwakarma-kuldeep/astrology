const { globalImageUploader } = require('../global/fileUploader')
const Admin = require('../models/admin')
const Horoscope = require('../models/horoscope')
const HoroscopeCategory = require('../models/horoscopeCategory')

exports.createHoroscopeCategory = async (req, res) => {
  const { name, description } = req.body
  try {
    if (!req.body)
      return res.status(400).json({ message: 'Please fill all the fields' })
    let horoscopeCategory = new HoroscopeCategory({
      name,
      description,
    })

    if (req.file || req.files) {
      if (req.files && req.files.length > 0) {
       for(let file = 0; file < req.files.length; file++) {
          const image = await globalImageUploader(
            req.files[file],
            horoscopeCategory._id,
            'horoscopeCategory',
          )
          horoscopeCategory.image = image.Location
        }
        await horoscopeCategory.save()
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
    if (!req.body || req.body === null)
      return res.status(400).json({ message: 'Please fill all the fields' })
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
        for (let file = 0; file < req.files.length; file++) {
          const image = await globalImageUploader(
            req.files[file],
            horoscope._id,
            'horoscope',
          )
          horoscope.image.push(image.Location)
        }
        await horoscope.save()
      } else {
        const image = await globalImageUploader(
          req.file,
          horoscope._id,
          'horoscope',
        )
        horoscope.image.push(image.Location)
        await horoscope.save()
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
    const date = req.query.date
    const horoscope = await Horoscope.find({date:date, isDeleted: false })
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
    const { title, description, date, time, horoscopeType } = req.body
    if (!req.body || req.body === null)
      return res.status(400).json({ message: 'Please fill all the fields' })
    const id = req.params.id
    let horoscope = await Horoscope.findById(id)
    if (!horoscope) {
      return res.status(404).json({ message: 'Horoscope not found' })
    }

    horoscope.title = title ? title : horoscope.title
    horoscope.description = description ? description : horoscope.description
    horoscope.date = date ? date : horoscope.date
    horoscope.time = time ? time : horoscope.time
    horoscope.horoscopeType = horoscopeType
      ? horoscopeType
      : horoscope.horoscopeType
    if (req.file || req.files) {
      if (req.files && req.files.length > 0) {
        for (let file = 0; file < req.files.length; file++) {
          const image = await globalImageUploader(
            req.files[file],
            horoscope._id,
            'horoscope',
          )
          horoscope.image.push(image.Location)
        }
        await horoscope.save()
      } else {
        if (req.file) {
          const image = await globalImageUploader(
            req.file,
            horoscope._id,
            'horoscope',
          )
          horoscope.image.push(image.Location)
          await horoscope.save()
        }
      }
    }
    await horoscope.save()
    return res.status(200).json({ message: 'Horoscope updated successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.updateHoroscopeCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!req.body || req.body === null)
      return res.status(400).json({ message: 'Please fill all the fields' })
    const id = req.params.id
    let horoscopeCategory = await HoroscopeCategory.findById(id)
    if (!horoscopeCategory) {
      return res.status(404).json({ message: 'Horoscope category not found' })
    }
    horoscopeCategory.name = name ? name : horoscopeCategory.name
    horoscopeCategory.description = description
      ? description
      : horoscopeCategory.description
    if (req.file || req.files) {
      if (req.files && req.files.length > 0) {
        const image = await globalImageUploader(
          req.files[0],
          horoscopeCategory._id,
          'horoscope',
        )
        horoscopeCategory.image = image.Location
        await horoscopeCategory.save()
      } else {
        if (req.file) {
          const image = await globalImageUploader(
            req.file,
            horoscopeCategory._id,
            'horoscope',
          )
          horoscopeCategory.image = image.Location
          await horoscopeCategory.save()
        }
      }
    }
    await horoscopeCategory.save()
    return res.status(200).json({
      message: 'Horoscope category updated successfully',
    })
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
   if(!req.body || req.body === null){
      return res.status(400).json({message:"Please fill all the fields"})
   }
    const { isDeleted } = req.body
    horoscope.isDeleted = isDeleted ? isDeleted : horoscope.isDeleted
    horoscope.deletedAt = isDeleted ? Date.now() : null
    await horoscope.save()
    return res.status(200).json({ message: 'Horoscope deleted successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}

exports.deleteHoroscopeCategory = async (req, res) => {
  try {
    const id = req.params.id
    let horoscopeCategory = await HoroscopeCategory.findById(id)
    if (!horoscopeCategory) {
      return res.status(404).json({ message: 'Horoscope category not found' })
    }
    if (!req.body || req.body === null) {
      return res.status(400).json({ message: 'Please fill all the fields' })
    }
    const { isDeleted } = req.body
    horoscopeCategory.isDeleted = isDeleted
      ? isDeleted
      : horoscopeCategory.isDeleted
    horoscopeCategory.deletedAt = isDeleted ? Date.now() : null
    await horoscopeCategory.save()
    return res.status(200).json({
      message: 'Horoscope category deleted successfully',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: error.message })
  }
}
