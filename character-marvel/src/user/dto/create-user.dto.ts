import { MaxLength, MinLength, IsNotEmpty, IsEmail, IsString, IsDate, MaxDate, Matches} from 'class-validator';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    login: string;
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @MinLength(8)
    @IsNotEmpty()
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
    password: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

}