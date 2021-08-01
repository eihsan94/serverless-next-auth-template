import express from 'express'
const userRoutes = express.Router()
import {
  // authUser,
  // getUserProfile,
  // updateUserProfile,
  registerUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  // deleteUser,
  // getUserById,
  // updateUser,
  // updateUserFavoriteProducts,
} from '../controllers/userController'
// import { protect, onlyPermit } from '../middleware/authMiddleware.js'
// import {PermissionType} from '@libTypes/enums'

userRoutes.route('/').post(registerUser).get(getUsers)
// userRoutes.route('/').post(registerUser).get(protect, onlyPermit(PermissionType.CAN_EDIT_USER), getUsers)
// userRoutes.post('/login', authUser)
// userRoutes
//   .route('/profile')
//   .get(protect, getUserProfile)
//   .put(protect, updateUserProfile)  
// userRoutes
//   .route('/favoriteProducts')
//   .put(protect, updateUserFavoriteProducts)

// // MAKE SURE THIS IS LAST BECAUSE /:id WILL GET EVERYTHING
userRoutes
  .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser)

// userRoutes
//   .route('/:id')
//   .delete(protect, onlyPermit(PermissionType.CAN_EDIT_USER), deleteUser)
//   .get(protect, onlyPermit(PermissionType.CAN_EDIT_USER), getUserById)
//   .put(protect, onlyPermit(PermissionType.CAN_EDIT_USER), updateUser)
export default userRoutes
