import { Router } from 'express';

import ShowUserController from '@modules/users/services/showUser/ShowUserController';
import ListUserController from '@modules/users/services/listUser/ListUserController';
import UpdateUserController from '@modules/users/services/updateUser/UpdateUserController';
import DeleteUserController from '@modules/users/services/deleteUser/DeleteUserController';
import CreateProfileController from '@modules/users/services/createProfile/CreateProfileController';
import ShowProfileController from '@modules/users/services/showProfile/ShowProfileController';
import ListProfileController from '@modules/users/services/listProfile/ListProfileController';
import UpdateProfileController from '@modules/users/services/updateProfile/UpdateProfileController';
import DeleteProfileController from '@modules/users/services/deleteProfile/DeleteProfileController';
import CreateAddressController from '@modules/users/services/createAddress/CreateAddressController';
import ShowAddressController from '@modules/users/services/showAddress/ShowAddressController';
import ListAddressController from '@modules/users/services/listAddress/ListAddressController';
import UpdateAddressController from '@modules/users/services/updateAddress/UpdateAddressController';
import DeleteAddressController from '@modules/users/services/deleteAddress/DeleteAddressController';
import uploadConfig from '@config/upload';
import multer from 'multer';
import CreateRoleController from '@modules/users/services/createRole/CreateRoleController';
import ShowRoleController from '@modules/users/services/showRole/ShowRoleController';
import ListRoleController from '@modules/users/services/listRole/ListRoleController';
import UpdateRoleController from '@modules/users/services/updateRole/UpdateRoleController';
import DeleteRoleController from '@modules/users/services/deleteRole/DeleteRoleController';
import CreatePermissionController from '@modules/users/services/createPermission/CreatePermissionController';
import ShowPermissionController from '@modules/users/services/showPermission/ShowPermissionController';
import ListPermissionController from '@modules/users/services/listPermission/ListPermissionController';
import UpdatePermissionController from '@modules/users/services/updatePermission/UpdatePermissionController';
import DeletePermissionController from '@modules/users/services/deletePermission/DeletePermissionController';
import AuthenticateUserController from '@modules/users/services/authenticateUser/AuthenticateUserController';
import SendForgotPasswordEmailController from '@modules/users/services/sendForgotPasswordEmail/SendForgotPasswordEmailController';
import ResetPasswordController from '@modules/users/services/resetPassword/ResetPasswordController';
import ShowSelfUserController from '@modules/users/services/showSelfUser/ShowSelfUserController';
import CreateUserController from '@modules/users/services/createUser/CreateUserController';

const userRouter = Router();
const upload = multer(uploadConfig.multer);
const listUserController = new ListUserController();
const showUserController = new ShowUserController();
const updateUserController = new UpdateUserController();
const deleteUserController = new DeleteUserController();
const createProfileController = new CreateProfileController();
const listProfileController = new ListProfileController();
const showProfileController = new ShowProfileController();
const updateProfileController = new UpdateProfileController();
const deleteProfileController = new DeleteProfileController();
const createAddressController = new CreateAddressController();
const listAddressController = new ListAddressController();
const showAddressController = new ShowAddressController();
const updateAddressController = new UpdateAddressController();
const deleteAddressController = new DeleteAddressController();
const createRoleController = new CreateRoleController();
const listRoleController = new ListRoleController();
const showRoleController = new ShowRoleController();
const updateRoleController = new UpdateRoleController();
const deleteRoleController = new DeleteRoleController();
const createPermissionController = new CreatePermissionController();
const listPermissionController = new ListPermissionController();
const showPermissionController = new ShowPermissionController();
const updatePermissionController = new UpdatePermissionController();
const deletePermissionController = new DeletePermissionController();
const authenticateUserController = new AuthenticateUserController();
const resetPasswordController = new ResetPasswordController();
const showSelfUserController = new ShowSelfUserController();
const createUserController = new CreateUserController();
const sendForgotPasswordEmailController =
  new SendForgotPasswordEmailController();

userRouter.post('/register', createUserController.handle);
userRouter.post('/forgot-password', sendForgotPasswordEmailController.handle);
userRouter.post('/reset-password', resetPasswordController.handle);
userRouter.post('/login', authenticateUserController.handle);
userRouter.get('/me', showSelfUserController.handle);
userRouter.get('/users/', listUserController.handle);
userRouter.get('/users/:id', showUserController.handle);
userRouter.put(
  '/users/:id',
  upload.single('avatar'),
  updateUserController.handle,
);
userRouter.delete('/users/:id', deleteUserController.handle);

userRouter.post(
  '/profiles',
  upload.single('avatar'),
  createProfileController.handle,
);
userRouter.get('/profiles', listProfileController.handle);
userRouter.get('/profiles/:id', showProfileController.handle);
userRouter.put(
  '/profiles/:id',
  upload.single('avatar'),
  updateProfileController.handle,
);
userRouter.delete('/profiles/:id', deleteProfileController.handle);

userRouter.post('/addresses', createAddressController.handle);
userRouter.get('/addresses', listAddressController.handle);
userRouter.get('/addresses/:id', showAddressController.handle);
userRouter.put('/addresses/:id', updateAddressController.handle);
userRouter.delete('/addresses/:id', deleteAddressController.handle);

userRouter.post('/roles', createRoleController.handle);
userRouter.get('/roles', listRoleController.handle);
userRouter.get('/roles/:id', showRoleController.handle);
userRouter.put('/roles/:id', updateRoleController.handle);
userRouter.delete('/roles/:id', deleteRoleController.handle);

userRouter.post('/permissions', createPermissionController.handle);
userRouter.get('/permissions', listPermissionController.handle);
userRouter.get('/permissions/:id', showPermissionController.handle);
userRouter.put('/permissions/:id', updatePermissionController.handle);
userRouter.delete('/permissions/:id', deletePermissionController.handle);

export default userRouter;
