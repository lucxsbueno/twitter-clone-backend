const router = require('express').Router();

const { checkToken } = require('../../middlewares/check.token');

const { createUser, findUserById, findAllUsers, updateUser, deleteUser, signIn } = require('./user.controller');

router.post('/signin', signIn);

router.get('/', checkToken, findAllUsers);
router.post('/', createUser);
router.get('/:id', checkToken, findUserById);
router.put('/:id', checkToken, updateUser);
router.delete('/:id', checkToken,  deleteUser);

module.exports = router;