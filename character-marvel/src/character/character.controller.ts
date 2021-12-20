import { Controller, Get, Post, Body, Put, Param, Delete, Req, CACHE_MANAGER, Inject, UseInterceptors, CacheTTL, CacheInterceptor, UseGuards, NotImplementedException, Query } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { UpdateCharacterDto } from './dto/update-character.dto';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Character } from './entities/character.entity';
import { QueryCharacterDTO } from './dto/query-character.dto';


@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createCharacterDto: CreateCharacterDto, @Req() req) {  
    const bodyResponse: Character =  await this.characterService.create(createCharacterDto, req.user._id);
    delete bodyResponse.userId;
    return bodyResponse;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateCharacterDto: UpdateCharacterDto) {
    const bodyResponse: Character = await this.characterService.update(id, updateCharacterDto);
    delete bodyResponse.userId;
    return bodyResponse;
  }

  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(30)
  // async getBalanceUserId(@Param('id') userId: string) {
  //   return await this.characterService.getBalanceByUserId(userId);
  // }

  async getTotalByLogin(userId: string) {
    const cacheKey: string = 'balance-userId-' + userId;
    const cachedData: any = await this.cacheManager.get(cacheKey);    
    if(cachedData) {
      console.log("Return Cached Data, key: " + cacheKey);
      return cachedData.data;
    } else {
      console.log("There is no cache.");
      const currentData: any = { data: await this.characterService.getTotalByUserId(userId) };
      console.log("Store in key " + cacheKey)
      this.cacheManager.set(cacheKey, currentData, { ttl: 60 });
      console.log("Return Current Data.")
      return currentData.data;
    }    
  } 

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() queryCharacterDTO: QueryCharacterDTO, @Req() req)  {
    const totalPromise = this.getTotalByLogin(req.user._id);
    const pageNumber: number = queryCharacterDTO.pageNumber;    
    const pageSize: number = queryCharacterDTO.pageSize;     
    const recordsPromise = this.characterService.findAllByUserId(req.user._id, queryCharacterDTO);        
    const recordsTotalPromise = this.characterService.countQuery(queryCharacterDTO);               
    const [records, total, recordsTotal] = await Promise.all([recordsPromise, totalPromise, recordsTotalPromise]);
    return {
      records,
      recordsTotal,
      pageNumber,
      pageSize,
      total
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const bodyResponse: Character = await this.characterService.findById(id);    
    delete bodyResponse._id;
    delete bodyResponse.userId;
    return bodyResponse;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return await this.characterService.remove(id);
  }
}
