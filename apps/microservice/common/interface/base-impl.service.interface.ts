// page-meta
import { MicroservicePageDto } from '@app/microservice/common/pagination/microservice-page.dto';
import { MicroservicePageOptionsDto } from '@app/microservice/common/pagination/microservice-page-options.dto';

export interface IBaseMicroserviceService<TCreateDto, TUpdateDto, TEntity> {
  create(createDto: TCreateDto): Promise<TEntity>;

  findAll(pageOptionsDto: MicroservicePageOptionsDto): Promise<MicroservicePageDto<TEntity>>;

  findOne(id: string): Promise<TEntity>;

  update(id: string, updateDto: TUpdateDto): Promise<TEntity>;

  remove(id: string): Promise<void>;
}