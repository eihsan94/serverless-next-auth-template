import { User } from '@libTypes/types'
import expressAsyncHandler from 'express-async-handler'
import { deleteSingle, getAll, getSingle, postSingle, putSingle, getAllUser } from '../utils/crudUtil'
import { encrypt } from '../utils/encryptionUtil'
import * as uuid from 'uuid'

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
*/
const getUsers = expressAsyncHandler(async ({res}) => {
  const result = await getAllUser('USER')
  return res.status(result.status).json(result.json)
})


/**
 * @desc    Get all users info including sessions and accounts provided by the provider
 * @route   GET /api/users
 * @access  Private/Admin
*/
const getAllUserInfo = expressAsyncHandler(async ({res}) => {
  const result = await getAllUser('')
  return res.status(result.status).json(result.json)
})


/**
 * @desc    Get all users that currently login into the app 
 * @route   GET /api/users
 * @access  Private/Admin
*/
const getCurrentLoginUsers = expressAsyncHandler(async ({res}) => {
  const result = await getAllUser('SESSION')
  return res.status(result.status).json(result.json)
})

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  all
*/
const getUserById = expressAsyncHandler(async (req, res) => {
  const result = await getAll('id', req.params.id, '-user')
  const user = result.json[0]
  return res.status(result.status).json(user)
})


/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
*/
const registerUser = expressAsyncHandler(async (req, res) => {
  const timestamp = new Date().getTime()
  const user: User = req.body
  const userExist = (await getAll('email', user.email, '-user')).json.length > 0
  if (userExist) {
    return res.status(400).json({error: 'このメールはすでに登録されています。'})
  }
  const id= uuid.v4()
  const Item = {
    pk: `USER#${id}`,
    sk: `USER#${id}`,
    id, 
    role_pk: user.role_pk,
    shop_pks: user.pk,
    email: user.email,
    password: await encrypt(user.password),
    nickname: user.nickname,
    image: user.image,
    birthday: user.birthday,
    type: 'USER',
    ihsanPoint: user.ihsanPoint || 0,
    createdAt: timestamp,
    updatedAt: timestamp
  }
  const result = await postSingle(Item, '-user')
  return res.status(result.status).json(result.json)
})

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
*/ 
const deleteUser = expressAsyncHandler(async (req, res) => {
  const id  = req.params.id
  const result = await deleteSingle(id, '-user')
  return res.status(result.status).json(result.json)
})

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateUserProfile = expressAsyncHandler(async (req, res) => {
  const id  = req.params.id
  const user: User = req.body
  const hashedPassword = user.password ? await encrypt(user.password) : ''
  const keyValArr = [
    {key: 'role_pk', val: user.role_pk} ,
    {key: 'shop_pks', val: user.shop_pks} ,
    {key: 'email', val: user.email} ,
    {key: 'password', val: hashedPassword} ,
    {key: 'nickname', val: user.nickname} ,
    {key: 'image', val: user.image} ,
    {key: 'birthday', val: user.birthday} ,
    {key: 'ihsanPoint', val: user.ihsanPoint} ,
  ]
  const result = await putSingle(id, keyValArr)
  return res.status(result.status).json(result.json)
})

export {
  getUsers,
  getUserById,
  deleteUser,
  getCurrentLoginUsers,
  getAllUserInfo,
  updateUserProfile,
  registerUser,
}