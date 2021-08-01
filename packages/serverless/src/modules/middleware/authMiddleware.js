import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Role from '../models/roleModel.js'
import Shop from '../models/shopModel.js'

// middleware for authentication
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')

      const shop = await Shop.findOne({user_id: req.user._id})
      req.user.shop_id = shop && shop._id

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})


// middleware for doing role-based permissions
const onlyPermit = (...permittedRoles) => {
  // return a middleware
  return asyncHandler(async (req, res, next) => {
    const { user } = req
    const permitted_roles = await Role.find({type: { "$in" : permittedRoles}})
    const permitted_role_ids = permitted_roles.map(r => r._id)
    if (user && permitted_role_ids.some(r => user.role_ids.includes(r))) {
      next(); // role is allowed, so continue on the next middleware
    } else {
      res.status(401)
      throw new Error(`You are not authorized. Only user with ${permittedRoles} role is permitted`)
    }
  })
}


export { protect, onlyPermit }
// add onlyPermit in product routes and check wether it works or not