import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const createdUser: User = await this.userService.create(createUserDto);
    if(createdUser) res.status(HttpStatus.CREATED).send();        
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':login')
  async findByLogin(@Param('login') login: string) {
    const user: User = await this.userService.findByLogin(login);
    if (!user) throw new NotFoundException("User Login Not Found", `There is no user record corresponding to this identifier: ${login}. The user may have been deleted.`)
    return user
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
