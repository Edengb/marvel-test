import { Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { QueryCharacterDTO } from './dto/query-character.dto';
import { Character, CharacterDocument } from './entities/character.entity';
import { Model, Schema } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class CharacterService {
  constructor(@InjectModel(Character.name) private characterModel: Model<CharacterDocument>,
  private readonly userService: UserService) {}

  async create(createCharacterDto: CreateCharacterDto, userId: string): Promise<Character> {
    const user = await this.userService.findById(userId);
    if(user) {
      const character = new Character();
      character.modified = createCharacterDto.modified;
      character.description = createCharacterDto.description;
      character.price = createCharacterDto.price;
      character.thumbnail = createCharacterDto.thumbnail;
      character.userId = user._id;
      const characteDoc: CharacterDocument = new this.characterModel(character);            
      await characteDoc.save();
      return characteDoc.toObject({ getters: true, versionKey: false, virtuals: false});
    } else {
       throw new NotFoundException("User Not Found", `There is no user record corresponding to this identifier: ${userId}. The user may have been deleted.`)
    }       
  }

  async getTotalByUserId(userId: string): Promise<number> {
    const userCharacters = await this.characterModel.find({ userId: userId });
    const total = userCharacters.reduce((acc, curr) => curr.price + acc, 0);
    return total
  }

  async findAllByUserId(userId: string, queryCharacterDTO: QueryCharacterDTO): Promise<Character[]> {
    const pageNumber: number = queryCharacterDTO.pageNumber;
    const pageSize: number = queryCharacterDTO.pageSize;
    const query: any = queryCharacterDTO;
    delete queryCharacterDTO.pageNumber;
    delete queryCharacterDTO.pageSize;
    query.userId = userId;
    return this.characterModel.find(query).skip(pageNumber).limit(pageSize).select("-__v -userId");
  }

  async countQuery(query: any) {
    return (await this.characterModel.find(query)).length;
  }

  async findAll(userId: string, queryCharacterDTO: QueryCharacterDTO): Promise<Character[]> {
    throw new NotImplementedException();
  }

  async findById(id: string): Promise<Character> {
    const doc = await this.characterModel.findById(id);
    if(doc) {
      return doc.toObject({ getters: true, versionKey: false, virtuals: false});
    } else {
      throw new NotFoundException("Character Not Found", `There is no character record corresponding to this identifier: ${id}. The character may have been deleted.`);
    }
  }

  async update(id: string, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const doc = await this.characterModel.findByIdAndUpdate({ _id: id }, updateCharacterDto, { new: true })
    if(doc) {
      return doc.toObject({ getters: true, versionKey: false, virtuals: false});
    } else {
      throw new NotFoundException("Character Not Found", `There is no character record corresponding to this identifier: ${id}. The character may have been deleted.`);
    }
  }

  remove(id: string) {
    const result = this.characterModel.findByIdAndRemove(id).exec();
  }
}
