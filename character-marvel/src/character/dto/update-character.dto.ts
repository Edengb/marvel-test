import { IsNotEmpty, Min, IsDate, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCharacterDto {    
    @IsDate()
    @Type(() => Date)
    @IsNotEmpty()
    modified: Date;

    @IsNumber()
    @IsNotEmpty()
    @Min(0)    
    price: number;

    @IsString()
    @IsNotEmpty()  
    description: string;

    @IsString()
    @IsNotEmpty()  
    thumbnail: string;
}
