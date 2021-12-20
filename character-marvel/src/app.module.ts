import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModule } from './character/character.module';
import { RouterModule } from 'nest-router';
import { routes } from './routes';

@Module({
  imports: [RouterModule.forRoutes(routes), AuthModule, UserModule, CharacterModule, MongooseModule.forRoot(process.env.MONGODB_URL  || 'mongodb://localhost:27017/marvel')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
