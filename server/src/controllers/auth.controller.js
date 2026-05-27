
import userModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from  '../config/config.js';

function createAccessToken(user) {
   return jwt.sign({
     id: user._id,
     role: user.role
   }, config.JWT_SECRET, {
     expiresIn: '15m'
   });
}

function createRefreshToken(user) {
   return jwt.sign({
     id: user._id,
     role: user.role
   }, config.JWT_SECRET, {
     expiresIn: '7d'
   });
}

function setRefreshTokenCookie(res, refreshToken) {
   res.cookie('refreshToken', refreshToken, {
     httpOnly: true,
     secure: config.NODE_ENV === 'production',
     sameSite: 'strict',
     maxAge: 7 * 24 * 60 * 60 * 1000
   });
}

export async function register(req, res) {
  try {
  const { name, username, email, password, role = 'candidate' } = req.body;

  if (!name || !username || !email || !password) {
     return res.status(400).json({ message: 'Name, username, email and password are required' });
  }

  if (!['recruiter', 'candidate'].includes(role)) {
     return res.status(400).json({ message: 'Invalid role' });
  }

  const isAlreadyRegistered = await userModel.findOne({ 
     $or: [    
          { username },
          { email }
     ]
   })

   if(isAlreadyRegistered) {
     return res.status(409).json({
          message: 'Username or email already exists'
     })
   }

   const hashedPassword = await bcrypt.hash(password, 12);

   const user = await userModel.create({
     name,
     username,
     email,
     password: hashedPassword,
     role
   })

   const accessToken = createAccessToken(user);
   const refreshToken = createRefreshToken(user);

   setRefreshTokenCookie(res, refreshToken);

   res.status(201).json({
     message: 'User registered successfully',
     user: {
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role
     },
     accessToken,
   })
  } catch (error) {
     res.status(500).json({ message: error.message });
  }

}

export async function login(req, res) {
     try {
          const { emailOrUsername, password } = req.body;

          if (!emailOrUsername || !password) {
               return res.status(400).json({ message: 'Email/username and password are required' });
          }

          const user = await userModel.findOne({
               $or: [
                    { email: emailOrUsername },
                    { username: emailOrUsername }
               ]
          }).select('+password');

          if (!user) {
               return res.status(401).json({ message: 'Invalid credentials' });
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
               return res.status(401).json({ message: 'Invalid credentials' });
          }

          const accessToken = createAccessToken(user);
          const refreshToken = createRefreshToken(user);

          setRefreshTokenCookie(res, refreshToken);

          res.status(200).json({
               message: 'Logged in successfully',
               user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role
               },
               accessToken
          });
     } catch (error) {
          res.status(500).json({ message: error.message });
     }
}

export async function getMe(req, res) {
     try {
     const user = req.user;

     res.status(200).json({
          message: 'User fetched successfully',
          user: {
               id: user._id,
               name: user.name,
               username: user.username,      
               email: user.email,
               role: user.role
          }
     })
     } catch (error) {
          res.status(500).json({ message: error.message });
     }

}

export async function refreshToken(req, res) {
     try {
     const refreshToken = req.cookies.refreshToken;

     if(!refreshToken) {
          return res.status(401).json({
               message: 'Refresh token not found'
          })
     }


     const decoded = jwt.verify(refreshToken, config.JWT_SECRET);
     const user = await userModel.findById(decoded.id);

     if (!user) {
          return res.status(401).json({ message: 'Invalid refresh token' });
     }

     const accessToken = createAccessToken(user);
     const newRefreshToken = createRefreshToken(user);

     setRefreshTokenCookie(res, newRefreshToken);

     res.status(200).json({
          message: 'Access token refreshed successfully',
          accessToken,
     })
     } catch (error) {
          res.status(401).json({ message: 'Invalid refresh token' });
     }

}

export async function logout(req, res) {
     res.clearCookie('refreshToken');
     res.status(200).json({ message: 'Logged out successfully' });
}
