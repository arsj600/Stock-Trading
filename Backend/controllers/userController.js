import userModel from "../models/userModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from 'validator'
import dotenv from 'dotenv';
dotenv.config();

const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          dob: user.dob,
          personalId: user.personalId,
          phoneno: user.phoneno,
        },
      });
      
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const { name, dob, personalId, phoneno, email, password } = req.body;

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Please enter a strong password (min 8 characters)" });
    }

    if (!validator.isDate(dob)) {
      return res.json({ success: false, message: "Invalid Date of Birth format (YYYY-MM-DD)" });
    }

    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 18) {
      return res.json({ success: false, message: "You must be at least 18 years old" });
    }

    if (!validator.isMobilePhone(phoneno, "en-IN")) {
      return res.json({ success: false, message: "Invalid phone number" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      dob,
      personalId,
      phoneno,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();

    const token = createToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        personalId: user.personalId,
        phoneno: user.phoneno,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export {login,register}