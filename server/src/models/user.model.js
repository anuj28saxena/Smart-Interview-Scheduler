
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
     name: {
          type: String,
          required: [true, 'Name is required']
     },
     username: {
          type: String,
          required: [true, 'Username is required'],
          unique: true
     },
     email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true
     },
     password: {
          type: String,
          required: [true, 'Password is required'],
          select: false
     },
     role: {
          type: String,
          enum: ["recruiter", "candidate"],
          default: "candidate"
     }

}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

export default userModel;
