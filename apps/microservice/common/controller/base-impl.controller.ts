import { RpcException, MessagePattern, Payload } from '@nestjs/microservices';

// interface
import { IBaseMicroserviceService } from '../interface/base-impl.service.interface';

// page-meta
import { MicroservicePageOptionsDto } from '@app/microservice/common/pagination/microservice-page-options.dto';

export class BaseMicroserviceController<
  TEntity,
  TService extends IBaseMicroserviceService<TCreateDto, TUpdateDto, TEntity>,
  TCreateDto,
  TUpdateDto
> {
  constructor(protected readonly service: TService, protected readonly pattern: any) { }

  @MessagePattern((pattern) => pattern.CREATE)
  async create(@Payload() createDto: TCreateDto) {
    try {
      return await this.service.create(createDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error creating entity!',
      });
    }
  }

  @MessagePattern((pattern) => pattern.FIND_ALL)
  async findAll(@Payload() pageOptionsDto: MicroservicePageOptionsDto) {
    try {
      return await this.service.findAll(pageOptionsDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || 'Error fetching entities!',
      });
    }
  }

  @MessagePattern((pattern) => pattern.FIND_ONE)
  async findOne(@Payload() id: string) {
    try {
      return await this.service.findOne(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error fetching entity with id: ${id}`,
      });
    }
  }

  @MessagePattern((pattern) => pattern.UPDATE)
  async update(@Payload() updateDto: TUpdateDto) {
    try {
      return await this.service.update(updateDto["id"], updateDto);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error updating entity with id: ${updateDto["id"]}`,
      });
    }
  }

  @MessagePattern((pattern) => pattern.DELETE)
  async remove(@Payload() id: string) {
    try {
      return await this.service.remove(id);
    } catch (error) {
      throw new RpcException({
        statusCode: 400,
        message: error.message || `Error deleting entity with id: ${id}`,
      });
    }
  }
}
