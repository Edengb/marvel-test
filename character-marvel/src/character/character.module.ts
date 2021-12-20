import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Character, CharacterSchema } from './entities/character.entity';
import { UserModule } from 'src/user/user.module';
import { CacheModule } from 'node_modules/@nestjs/common/cache/cache.module';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: Character.name, schema: CharacterSchema }]), 
  UserModule,
  CacheModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: process.env.REDIS_URL || 'localhost',
        port: '6379',
        ttl: 120
      }),
  }),
  ],
  controllers: [CharacterController],
  providers: [CharacterService]
})
export class CharacterModule {}