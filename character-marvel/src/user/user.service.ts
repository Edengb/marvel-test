import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
      
  async create(createUserDto: CreateUserDto): Promise<User> {
    const userDoc: UserDocument = new this.userModel(createUserDto);
    return userDoc.save();
  }

  findAll() {
    throw new NotImplementedException();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  findByLogin(login: string) {
    return this.userModel.findOne({ login: login }, '-__v')
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    throw new NotImplementedException();
  }

  remove(id: number) {
    throw new NotImplementedException();
  }      
}
