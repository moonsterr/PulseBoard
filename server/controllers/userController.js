import {
  createUser,
  findUserByEmail,
  comparePasswords,
  getUserInfoService,
  queryUsersService,
  addAuthorizedUserService,
  getAuthorizedByService,
  getAuthorizedUsersService,
  updateUsernameService,
} from '../services/userService.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const alreadyUser = await findUserByEmail(req.body.email);
    if (alreadyUser) {
      res.status(409).send({ success: false, data: 'email' });
    }
    const user = await createUser(req.body);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.status(201).send({ success: true, data: user });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, data: error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(401).send({ success: false, data: 'email' });
    const compare = await comparePasswords(password, user.password);
    if (!compare)
      return res.status(401).send({ success: false, data: 'password' });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).send({ success: true, data: token });
  } catch (err) {
    console.log(err);
    res.status(500).send({ success: false, data: err });
  }
};

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  return res.status(200).send({ success: true, data: 'Logged out' });
};
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await getUserInfoService(userId);
    if (!userData) {
      return res.status(401).send({ success: false, data: 'error' });
    }
    return res.status(200).send({ success: true, data: userData });
  } catch (error) {
    return res.status(401).send({ success: false, data: error });
  }
};
export const queryUsers = async (req, res) => {
  try {
    const name = req.query.name;
    const currentUserId = req.user?.id; // assuming middleware sets this

    const users = await queryUsersService(name, currentUserId);
    return res.status(200).send({ success: true, data: users });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: 'Server error' });
  }
};
export const addAuthorizedUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const addUserId = req.body.id;
    const authorized = await addAuthorizedUserService(userId, addUserId);
    if (!authorized) {
      return res.status(401).send({ success: false, data: authorized });
    }
    return res.status(200).send({ success: true, data: authorized });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ success: false, data: error });
  }
};
export const getAuthorizedBy = async (req, res) => {
  console.log('hio');
  try {
    const userId = req.user.id; // whoever is currently logged in
    const authorizedBy = await getAuthorizedByService(userId);

    return res.status(200).send({ success: true, data: authorizedBy });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, data: error.message });
  }
};

export const getAuthorizedUsers = async (req, res) => {
  try {
    const userId = req.user.id; // logged-in user
    const authorizedUsers = await getAuthorizedUsersService(userId);

    return res.status(200).send({ success: true, data: authorizedUsers });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, error: error.message });
  }
};
export const updateUsername = async (req, res) => {
  try {
    const username = req.body.username;
    const id = req.user.id;
    const updatedUsername = await updateUsernameService(id, username);
    if (updateUsername === 'username') {
      return res.status(400).send({ success: false, data: username });
    }
    console.log('yadasha');
    return res.status(200).send({ success: true, data: updateUsername });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, data: error.message });
  }
};
