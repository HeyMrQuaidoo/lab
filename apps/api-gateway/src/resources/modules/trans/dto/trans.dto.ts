import { ApiProperty } from "@nestjs/swagger";

export class TransDto {
    @ApiProperty({ description: 'Transaction ID', example: '123e4567-e89b-12d3-a456-426614174000' })
    trans_id: string;
  
    @ApiProperty({ description: 'Bank ID', example: '001' })
    bank_id: string;
  
    @ApiProperty({ description: 'Institution ID', example: 123 })
    inst_id: number;
  
    @ApiProperty({ description: 'Branch Name', example: 'Main Branch' })
    branch: string;
  
    @ApiProperty({ description: 'Account Number', example: '1234567890' })
    account_no: string;
  
    @ApiProperty({ description: 'Payer ID', example: 98765 })
    payer_id: number;
  
    @ApiProperty({ description: 'Transaction Date Created', example: '2024-02-10' })
    date_created: Date;
  
    @ApiProperty({ description: 'Transaction Amount', example: 500.75 })
    amount: number;
  }  