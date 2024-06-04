const Food = require("../Models/Food");

const createFood = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      rating,
      foodImage,
      location,
      weight,
    } = req.body;
    const food = new Food({
      name,
      price,
      description,
      category,
      rating,
      weight,
      location,
      foodImage,
    });
    const savedFood = await food.save();
    res.status(200).json({
      message: "Yemek eklendi",
      data: {
        food: savedFood,
      },
      success: true,
    });
  } catch (error) {
    console.log("🚀 ~ createFood ~ error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const getAllFoods = async (req, res) => {
  try {
    const { category } = req.query;
    if (category === "all") {
      const food = await Food.find();
      console.log("🚀 ~ getAllFoods ~ food:", food);
      res.status(200).json({
        message: "Yemeklerin Hepsi getirildi",
        success: true,
        data: {
          food,
        },
      });
    } else {
      const food = await Food.find({ category });
      console.log("🚀 ~ getAllFoods ~ foodItem:", food);
      res.status(200).send({
        message: "Yemekler getirildi Category",
        success: true,
        data: {
          food,
        },
      });
    }
  } catch (error) {
    console.log("🚀 ~ getAllFoods ~ error:", error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const foodDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    console.log("🚀 ~ foodDetails ~ food:", food);
    res.status(200).json({
      message: "Yemekler getirildi",
      success: true,
      data: {
        food,
      },
    });
    if (food === null) {
      res.status(404).json({ message: "Yemek bulunamadı", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getNewFoods = async (req, res) => {
  try {
    const food = await Food.find().sort({ createdAt: -1 }).limit(12);
    console.log("🚀 ~ getNewFoods ~ food:", food);
    res.status(200).json({
      message: "Yemekler getirildi",
      success: true,
      data: {
        food,
      },
    });
  } catch (error) {
    console.log("🚀 ~ getNewFoods ~ error:", error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

const getFoodDisctinct = async (req, res) => {
  try {
    const disctinctCategory = await Food.distinct("category");
    const disctincFood = await Promise.all(
      disctinctCategory.slice(0, 5).map(async (category) => {
        const food = await Food.find({ category: category });
        return food;
      })
    );
    res.status(200).json({
      message: "Yemekler getirildi",
      success: true,
      data: {
        food: disctincFood,
      },
    });
  } catch (error) {
    console.log("🚀 ~ getFoodDisctinct ~ error:", error);
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
const getTopRating = async (req, res) => {
  try {
    const rating = await Food.find().sort({ "reviews.rating": -1 }).limit(4);
    res.status(200).json({
      message: "Yemekler getirildi",
      success: true,
      data: {
        food: rating,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
module.exports = {
  createFood,
  getAllFoods,
  foodDetails,
  getNewFoods,
  getFoodDisctinct,
  getTopRating,
};
