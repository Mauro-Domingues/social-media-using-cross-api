import './providers';

import { container } from 'tsyringe';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import PostsRepository from '@modules/posts/repositories/PostsRepository';
import ICommentsRepository from '@modules/posts/repositories/ICommentsRepository';
import CommentsRepository from '@modules/posts/repositories/CommentsRepository';
import IAnswersRepository from '@modules/posts/repositories/IAnswersRepository';
import AnswersRepository from '@modules/posts/repositories/AnswersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/repositories/UsersRepository';
import ITokensRepository from '@modules/users/repositories/ITokensRepository';
import TokensRepository from '@modules/users/repositories/TokensRepository';
import IProfilesRepository from '@modules/users/repositories/IProfilesRepository';
import ProfilesRepository from '@modules/users/repositories/ProfilesRepository';
import IAddressesRepository from '@modules/users/repositories/IAddressesRepository';
import AddressesRepository from '@modules/users/repositories/AddressesRepository';
import IRolesRepository from '@modules/users/repositories/IRolesRepository';
import RolesRepository from '@modules/users/repositories/RolesRepository';
import IPermissionsRepository from '@modules/users/repositories/IPermissionsRepository';
import PermissionsRepository from '@modules/users/repositories/PermissionsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<ITokensRepository>(
  'TokensRepository',
  TokensRepository,
);

container.registerSingleton<IProfilesRepository>(
  'ProfilesRepository',
  ProfilesRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository,
);

container.registerSingleton<IPermissionsRepository>(
  'PermissionsRepository',
  PermissionsRepository,
);

container.registerSingleton<IPostsRepository>(
  'PostsRepository',
  PostsRepository,
);

container.registerSingleton<ICommentsRepository>(
  'CommentsRepository',
  CommentsRepository,
);

container.registerSingleton<IAnswersRepository>(
  'AnswersRepository',
  AnswersRepository,
);
