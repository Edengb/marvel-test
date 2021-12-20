import { Routes } from 'nest-router';
import { AuthModule } from './auth/auth.module';
import { CharacterModule } from './character/character.module';
import { UserModule } from './user/user.module';

export const routes: Routes = [
  {
    path: 'api/v1',
    children: [AuthModule, CharacterModule, UserModule]
  },
];
