import { IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';

// dto
import { CreateTransDto } from './create-trans.dto';

export class UpdateTransDto extends PartialType(CreateTransDto) {
    @IsOptional()
    @ApiPropertyOptional({ description: 'Transaction ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    trans_id?: string;
}
