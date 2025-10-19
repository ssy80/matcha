import express from 'express';
import { ApiJsonResponse } from '../utils/responseUtil.js';
//import sqlite3 from 'sqlite3';
//import { open } from 'sqlite';
//import { User } from '../models/user.js'
//import { Validation } from '../utils/validationUtils.js';
//import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
//import crypto from "crypto";
//import { UserActivation } from '../models/user_activation.js';
//import { sendActivationEmail } from '../services/emailService.js';
import { registerUser, activateUser, userLogin, resetPasswordRequest } from '../services/userServices.js';

dotenv.config();

//const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS)
//const db = new sqlite3.Database('././database/matcha.db');

/*const db = await open({
  filename: '././database/matcha.db',
  driver: sqlite3.Database
});*/


//export const router = express.Router();
const router = express.Router();

router.post('/register', async (req, res) => {
    await registerUser(req, res);
});


router.get('/activate', async (req, res) => {
    await activateUser(req, res);
});


router.post('/login', async (req, res) => {
    await userLogin(req, res);
});

//resetPassword
router.post('/reset_password_request', async (req, res) => {
    await resetPasswordRequest(req, res);
});

router.get('/is_valid_email', (req, res) => {
  res.json({ message: 'Users route' });
});


 //validate user fields
  //email - 3-50 valid email 
  //username - 3-50 (alphanumeric)
  //firstname - 3-50 (alpha)
  //lastname - 3-50 (alpha)
  //userPassword - 6-12 (1 upper, 1 lower, 1 number, 1 special char)
/*function validateUserFields(user)
{
  //console.log(user.email)
  //console.log(Validation.isEmail(user.email))
  //console.log(Validation.isLengthBetween(user.email, 3, 50))

  if (!Validation.isEmail(user.email) || !Validation.isLengthBetween(user.email, 3, 50))
    return false;

  if (!Validation.isAlphaNumeric(user.username) || !Validation.isLengthBetween(user.username, 3, 50))
    return false;

  if (!Validation.isLengthBetween(user.firstName, 3, 50))
    return false;

  if (!Validation.isLengthBetween(user.lastName, 3, 50))
    return false;

  if (!Validation.isValidPassword(user.userPassword))
    return false;

  return true;
}*/

/*async function validateUserEmail(user)
{
    try{
      const row = await db.get('SELECT * FROM users WHERE email = ?', [user.email])
      //return !row;
      //console.log(row)
      if (row)
          return false;
        else
          return true;
    }
    catch(err)
    {
      throw err;
    }
}*/

/*async function validateUsername(user)
{
    try{
      const row = await db.get('SELECT * FROM users WHERE username = ?', [user.username])

      if (row)
          return false;
        else
          return true;
    }
    catch(err)
    {
      throw err;
    }
}*/

/*async function addUser(user)
{
  try{
      const result = await db.run('INSERT INTO users(email, username, first_name, last_name, user_password, user_status, created_at, updated_at) \
                            values(?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [user.email, user.username, user.firstName, user.lastName, user.userPassword, user.userStatus])

      return result.lastID;
    }
    catch(err)
    {
      throw err;
    }
}*/


/*async function addUserActivation(userActivation)
{
  try{
      const result = await db.run('INSERT INTO user_activation(activation_uuid, activation_status, user_id, created_at, updated_at) \
                            values(?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)',
                            [userActivation.activation_uuid, userActivation.activation_status, userActivation.user_id])

      return result.lastID;
    }
    catch(err)
    {
      throw err;
    }
}*/

/*async function validateUserEmail(user) {
  try {
    const row = await db.get('SELECT * FROM users WHERE email = ?', [user.email]);
    return !row; // true if not found
  } catch (err) {
    throw err;
  }
}*/

/*async function encryptUserPassword(user)
{
  const hashPassword = await bcrypt.hash(user.userPassword, saltRounds);
  return hashPassword
}*/

router.get('/', (req, res) => {
  res.json({ message: 'Users route' });
});

///api/users/{id}
router.get('/{id}', (req, res) => {
  res.json({ message: 'Users route' });
});

export default router;
//export {router}