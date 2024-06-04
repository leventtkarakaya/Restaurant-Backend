const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/User.js");
const otpGenerator = require("otp-generator");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
dotenv.config();

const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(500).send({
        message: "Kullanıcı zaten mevcut",
        success: false,
      });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);

    if (!salt) {
      throw new Error("Şifreleme sırasında hata oluştu.");
    }

    const hashPassword = await bcrypt.hash(password, salt);

    if (!hashPassword) {
      throw new Error("Şifreleme sırasında hata oluştu.");
    }

    req.body.password = hashPassword;
    req.body.passwordConfrim = hashPassword;

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    req.body.otp = otp;

    if (req.body.password === req.body.passwordConfrim) {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfrim: req.body.passwordConfrim,
        profileImage: req.body.profileImage,
        otp: otp,
      });
      const result = await newUser.save();

      if (!result) {
        throw new Error("Kayıt sırasında hata oluştu.");
      }

      const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "dd0133195@gmail.com",
          pass: "eundcnudgxhhmphi",
        },
      });

      const mailOptions = {
        from: "dd0133195@gmail.com",
        to: "leventtkarakaya@gmail.com",
        subject: "E-posta doğrulaması için OTP'niz",
        text: `Hesap doğrulaması için: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

      return res.status(201).send({
        message: "Kayıt başarılı",
        data: {
          user: result,
          token,
        },
        success: true,
      });
    }
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
    res
      .status(500)
      .send({ message: "Kayıt sırasında hata oluştu.", success: false });
  }
};

const authControllers = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).json({
        message: "Kullanıcı bulunamadı",
        success: false,
      });
    } else {
      res.status(200).json({
        message: "Kullanıcı bulundu",
        data: {
          user: user,
        },
        success: true,
      });
    }
  } catch (error) {
    console.log("🚀 ~ authControllers ~ error:", error);
    res.status(500).send({
      success: false,
      message: "Yetkiniz yok",
    });
  }
};

const loginControllers = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );

    if (!user) {
      return res.status(401).send({
        message: "Kullanınıcı bulunamadı",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    const singuser = await User.findOne({ email: req.body.email });
    if (!isMatch) {
      return res.status(401).send({
        message: "Geçersiz e-posta veya şifre",
        success: false,
      });
    }
    const token = jwt.sign({ id: singuser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // ? 1 day
    });
    return res.status(200).send({
      message: "Başarıyla giriş yapıldı",
      data: {
        user: singuser,
        token,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Auth error",
      success: false,
    });
  }
};

const verifyOtpControllers = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Kullanıcı bulunamadı", success: false });
    }
    if (user.otp === req.body.combinedOtp) {
      console.log("🚀 ~ verifyOtpControllers ~ user.otp:", user.otp);
      user.isVerified = true;
      await user.save();
      res
        .status(200)
        .json({ message: "OTP doğrulaması onaylandı", success: true });
    } else {
      res.status(400).json({ message: "OTP onaylanmadı", success: false });
    }
  } catch (error) {
    console.log("🚀 ~ verifyOtpControllers ~ error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const {
      name,
      profileImage,
      email,
      country,
      zipCode,
      city,
      userId,
      district,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(400).json({
        message: "Kullanıcı bulunamadı",
        success: false,
      });
    }
    user.profileImage = profileImage || user.profileImage;
    user.name = name || user.name;
    user.email = email || user.email;
    user.country = country || user.country;
    user.zipCode = zipCode || user.zipCode;
    user.city = city || user.city;
    user.district = district || user.district;
    await user.save();
    res.status(200).json({
      message: "Kullanıcı bilgileri güncellendi",
      success: true,
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
module.exports = {
  register,
  authControllers,
  loginControllers,
  verifyOtpControllers,
  updateUserProfile,
};
