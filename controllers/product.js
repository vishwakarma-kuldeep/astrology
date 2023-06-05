const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const Product = require("../models/product");
const { imageUpload } = require("../global/fileUploader");
const Discount = require("../models/discount");


exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      price,
      discount,
      HSNCODE,
      GST,
      inStock,
      quantity,
      SKU,
    } = req.body;
    let product = await Product.findOne({ name, category, subCategory });
    if (product) {
      return res.status(400).json({ message: "Product already exists" });
    }
    product = new Product();
    product.name = name;
    product.description = description;
    product.category = category;
    product.subCategory = subCategory;
    product.price = price;
    product.discount = discount;
    product.HSNCODE = HSNCODE;
    product.GST = GST;
    product.inStock = inStock;
    product.quantity = quantity;
    product.SKU = SKU;

    if (req.files || req.file) {
      if (req.files.length > 1) {
        req.files.map(async (file) => {
          const image = await imageUpload(file, product._id);
          product.image.push(image.Location);
        });
      } else {
        const image = await imageUpload(req.files[0], product._id);
        product.image.push(image.Location);
      }
      if (req.file) {
        const image = await imageUpload(req.file, product._id);
        product.image.push(image.Location);
      }
    }
    await product.save();
    return res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      price,
      discount,
      HSNCODE,
      GST,
      inStock,
      quantity,
      SKU,
      isDeleted,
    } = req.body;
    const id = req.params.id;
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.name = name ? name : product.name;
    product.description = description ? description : product.description;
    product.category = category ? category : product.category;
    product.subCategory = subCategory ? subCategory : product.subCategory;
    product.price = price ? price : product.price;
    product.discount = discount ? discount : product.discount;
    product.HSNCODE = HSNCODE ? HSNCODE : product.HSNCODE;
    product.GST = GST ? GST : product.GST;
    product.inStock = inStock ? inStock : product.inStock;
    product.quantity = quantity ? quantity : product.quantity;
    product.SKU = SKU ? SKU : product.SKU;
    product.isDeleted = isDeleted ? isDeleted : product.isDeleted;
    if(isDeleted){
        product.deletedAt = Date.now();
    }
    
    if (req.files || req.file) {
      if (req.files.length > 1) {
        console.log("I am here")
        req.files.map(async (file) => {
          const image = await imageUpload(file, product._id);
          product.image.push(image.Location);
        });
      } else {
        const image = await imageUpload(req.files[0], product._id);
        product.image.push(image.Location);
      }
      if (req.file) {
        const image = await imageUpload(req.file, product._id);
        product.image.push(image.Location);
      }
    }
    await product.save();
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

exports.removeImage = async (req, res) => {
    try{
        const id = req.params.id;
        const imageId = req.body.image;
        let product = await Product.findOne({_id:id});
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        product.image = product.image.filter((image)=>image._id != imageId);
        await product.save();
        return res.status(200).json({message:"Image removed successfully"})
    }catch(error){
        console.error(error);
        return res.status(500).json({message:error.message})
    }
}

exports.addImage = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        if(req.files || req.file){
            if(req.files.length > 1){
                req.files.map(async (file)=>{
                    const image = await imageUpload(file, product._id);
                    product.image.push(image.Location);
                })
            }else{
                const image = await imageUpload(req.files[0], product._id);
                product.image.push(image.Location);
            }
            if(req.file){
                const image = await imageUpload(req.file, product._id);
                product.image.push(image.Location);
            }
        }
        await product.save();
        return res.status(200).json({message:"Image added successfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:error.message})

    }
}

exports.deleteProduct = async (req, res) => {
    try{
        const id = req.params.id;
        let product = await Product.findById(id);
        if(!product){
            return res.status(404).json({message:"Product not found"})
        }
        product.isDeleted = true;
        product.deletedAt = Date.now();
        await product.save();
        return res.status(200).json({message:"Product deleted successfully"})
    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:error.message})
    }
}

exports.getAllProducts = async (req, res) => {
    try{
        const products = await Product.find({isDeleted:false}).populate([
          {
            path: "discount",
          },
          {
            path: "category",
          },
          {
            path: "subCategory",
          },
        ]);
        return res.status(200).json({products})
    }catch(error){
        console.error(error);
        return res.status(500).json({message:error.message})
    }
};

exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate([
      {
        path: "discount",
      },
      {
        path: "category",
      },
      {
        path: "subCategory",
      },
    ]);
    return res.status(200).json({ product });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
exports.addDiscount = async (req, res) => {
  const id = req.params.id;
  const {discountPercentage,name,description,isActivated} = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const discount = new Discount({
      discountPercentage,
      name,
      description,
      isActivated,
      product: product._id,
    });
    await discount.save();
    product.discount = discount._id;
    await product.save();
    return res.status(200).json({ message: "Discount added successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


exports.getProductsByCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Product.find({ category: id, isDeleted: false }).populate([
      {
        path: "discount",
      },
      {
        path: "category",
      },
      {
        path: "subCategory",
      },
    ]);
    return res.status(200).json({ products });
  } catch (error) {
    console.error(error);;
    return res.status(500).json({ message: error.message });
  }
}
exports.getProductsBySubCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Product.find({ subCategory: id, isDeleted: false }).populate([
      {
        path: "discount",
      },
      {
        path: "category",
      },
      {
        path: "subCategory",
      },
    ]);
    return res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
