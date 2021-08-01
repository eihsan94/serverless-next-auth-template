import expressAsyncHandler from 'express-async-handler'
import {User} from '@libTypes/types'
import * as uuid from 'uuid'
import { encrypt } from '../utils/encryptionUtil'
import { deleteSingle, getAll, getSingle, postSingle, putSingle } from '../utils/crudUtil'

const partitionKeyPrefix = 'users'
/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
*/
const getUsers = expressAsyncHandler(async ({res}) => {
  const result = await getAll('partition_key', partitionKeyPrefix)
  return res.status(result.status).json(result.json)
})

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
*/
const registerUser = expressAsyncHandler(async (req, res) => {
  const timestamp = new Date().getTime()
  const user: User = req.body
  const userExist = (await getAll('email', user.email)).json.length > 0
  if (userExist) {
    return res.status(400).json({error: 'User already exists'})
  }
  const Item = {
    partition_key: `${uuid.v4()}-${partitionKeyPrefix}`,
    role_partition_key: user.role_partition_key,
    shop_partition_keys: user.partition_key,
    email: user.email,
    password: await encrypt(user.password),
    fullname: user.fullname,
    image: user.image,
    birthday: user.birthday,
    ihsanPoint: user.ihsanPoint,
    createdAt: timestamp,
    updatedAt: timestamp
  }
  const result = await postSingle(Item)
  return res.status(result.status).json(result.json)
})

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  all
*/
const getUserById = expressAsyncHandler(async (req, res) => {
  const result = await getSingle(req.params.id)
  delete result.json.password
  return res.status(result.status).json(result.json)
})
/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUser = expressAsyncHandler(async (req, res) => {
  const id  = req.params.id
  const user: User = req.body
  const hashedPassword = user.password ? await encrypt(user.password) : ''
  const keyValArr = [
    {key: 'role_partition_key', val: user.role_partition_key} ,
    {key: 'shop_partition_keys', val: user.shop_partition_keys} ,
    {key: 'email', val: user.email} ,
    {key: 'password', val: hashedPassword} ,
    {key: 'fullname', val: user.fullname} ,
    {key: 'image', val: user.image} ,
    {key: 'birthday', val: user.birthday} ,
    {key: 'ihsanPoint', val: user.ihsanPoint} ,
  ]
  const result = await putSingle(id, keyValArr)
  return res.status(result.status).json(result.json)
  
})

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
*/ 
const deleteUser = expressAsyncHandler(async (req, res) => {
  const id  = req.params.id
  const result = await deleteSingle(id)
  return res.status(result.status).json(result.json)
})


// // @desc    Auth user & get token
// // @route   POST /api/users/login
// // @access  Public
// const authUser = expressAsyncHandler(async (req, res) => {
//   const { email, password } = req.body
//   const date = new Date();
//   date.setDate(date.getDate() + 10);
  
//   const user = await User.findOne({ email })
//   if (user && (await user.matchPassword(password))) {
//     const user_roles = await Role.find({_id: { "$in" : user.role_ids}})
//     const user_role_types = user_roles.map(r => r.type)
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       favoriteProductIds: user.favoriteProductIds,
//       role_ids: user.role_ids,
//       address: user.address,
//       city: user.city,
//       postalCode: user.postalCode,
//       country: user.country,
//       roles: user_role_types,
//       token: generateToken(user._id),
//       expiresIn: date
//     })
//   } else {
//     res.status(401)
//     throw new Error('Invalid email or password')
//   }
// })

export {
  getUsers,
  registerUser,
  getUserById,
  updateUser,
  deleteUser,
//   authUser,
}
