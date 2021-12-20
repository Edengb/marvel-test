import { IsOptional, Min, IsDate, IsString, IsNumber, IsPositive } from 'class-validator';


export class QueryCharacterDTO {
    @IsDate()
    @IsOptional()
    readonly modified?: Date;
  
    @IsNumber()
    @Min(0)
    @IsOptional()
    readonly price?: number;
    
    @IsString()
    @IsOptional()
    readonly description?: string;

    @IsString()
    @IsOptional()
    readonly thumbnail?: string;
  
    @IsOptional()
    @IsPositive()
    pageSize?: number;
  
    @IsOptional()
    @Min(0)
    pageNumber?: number;
}