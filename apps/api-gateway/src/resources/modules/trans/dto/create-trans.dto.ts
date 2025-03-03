import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum, IsDate } from 'class-validator';

export class CreateTransDto {
  @ApiProperty({ description: 'Bank ID', example: '001' })
  @IsString()
  bank_id: string;

  @ApiProperty({ description: 'Institution ID', example: 123 })
  @IsNumber()
  inst_id: number;

  @ApiProperty({ description: 'Branch Name', example: 'Main Branch' })
  @IsString()
  branch: string;

  @ApiProperty({ description: 'Account Number', example: '1234567890' })
  @IsString()
  account_no: string;

  @ApiProperty({ description: 'Payer ID', example: 98765 })
  @IsNumber()
  payer_id: number;

  @ApiProperty({ description: 'Transaction Date Created', example: '2024-02-10' })
  @IsDate()
  date_created: Date;

  @ApiProperty({ description: 'Transaction Amount', example: 500.75 })
  @IsNumber()
  amount: number;
}