import { Controller, Post, Get, Patch, Delete, Body, Param, Query, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

// dto
import { TransDto } from './dto/trans.dto';
import { CreateTransDto } from './dto/create-trans.dto';
import { UpdateTransDto } from './dto/update-trans.dto';

// service
import { TransService } from './trans.service';
import { PageOptionsDto } from 'apps/common/dto/page-meta/page-optional.dto';

@ApiBearerAuth()
@Controller('trans')
export class TransController {
    constructor(private readonly transService: TransService) { }

    @Post()
    @ApiOperation({ summary: 'Create Transaction' })
    @ApiResponse({ status: 201, description: 'Transaction created successfully.', type: TransDto })
    async create(@Body() createTransDto: CreateTransDto) {
        return this.transService.create(createTransDto);
    }

    @Get()
    @ApiOperation({ summary: 'Fetch All Transactions' })
    @ApiResponse({ status: 200, description: 'Successfully fetched transactions.', type: [TransDto] })
    async findAll(@Query() pageOptionsDto: PageOptionsDto) {
        return  await this.transService.findAll(pageOptionsDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Fetch Single Transaction' })
    @ApiResponse({ status: 200, description: 'Successfully fetched transaction.', type: TransDto })
    async findOne(@Param('id') id: string) {
        return this.transService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update Transaction' })
    @ApiResponse({ status: 200, description: 'Successfully updated transaction.', type: TransDto })
    async update(@Param('id') id: string, @Body() updateTransDto: UpdateTransDto) {
        return this.transService.update(id, updateTransDto);
    }

    @Delete(':id')
    @HttpCode(204)
    @ApiOperation({ summary: 'Delete Transaction' })
    async remove(@Param('id') id: string) {
        await this.transService.remove(id);
    }
}