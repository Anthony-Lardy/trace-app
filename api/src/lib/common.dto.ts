import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class FilterDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public filter: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    public fields: string;

    @ApiPropertyOptional({
        type: Number,
        minimum: 1,
        default: 1000,
    })
    @IsOptional()
    @IsNumberString()
    public limit: string;

    @ApiPropertyOptional({
        type: Number,
        minimum: 1,
        default: 1,
    })
    @IsOptional()
    @IsNumberString()
    public page: string;
}