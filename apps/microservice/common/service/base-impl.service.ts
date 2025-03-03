import { plainToInstance } from 'class-transformer';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

// page-meta
import { MicroservicePageDto } from '../pagination/microservice-page.dto';
import { MicroservicePageMetaDto } from '../pagination/microservice-page-meta.dto';
import { MicroservicePageOptionsDto } from '../pagination/microservice-page-options.dto';

export class BaseService<
    TEntity extends TDto, TDto extends object,
    TCreateDto extends DeepPartial<TEntity>,
    TUpdateDto extends DeepPartial<TEntity>
> {
    constructor(
        protected readonly repository: Repository<TEntity>,
        private readonly dtoClass: { new(): TDto },
        private readonly entityModel: string,
        private readonly entityPrimaryKey: string,
        private readonly defaultWhere?: FindOptionsWhere<TEntity>,
        private readonly orderByDefualt: string = 'created_at' || 'date_created'
    ) { }

    async create(createDto: TCreateDto): Promise<TEntity> {
        const newEntity = this.repository.create(createDto);

        return this.repository.save(newEntity);
    }

    async findAll(
        pageOptionsDto: MicroservicePageOptionsDto,
        where?: FindOptionsWhere<TEntity>
    ): Promise<MicroservicePageDto<TDto>> {
        const options = plainToInstance(MicroservicePageOptionsDto, pageOptionsDto);
        const queryBuilder = this.repository.createQueryBuilder(this.entityModel);

        if (where || this.defaultWhere) {
            Object.entries({ ...this.defaultWhere, ...where }).forEach(([key, value]) => {
                queryBuilder.andWhere(`${this.entityModel}.${key} = :${key}`, { [key]: value });
            });
        }
        
        queryBuilder
            .orderBy(`${this.entityModel}.${this.orderByDefualt}`, pageOptionsDto.order)
            .skip(options.skip)
            .take(options.limit);

        const [entities, itemCount] = await queryBuilder.getManyAndCount();
        const pageMetaDto = new MicroservicePageMetaDto({ itemCount, pageOptionsDto });

        return new MicroservicePageDto<TDto>(entities, pageMetaDto);
    }

    async findOne(
        id: string,
        where?: FindOptionsWhere<TEntity>
    ): Promise<TDto> {
        const entity = await this.findEntityById(id, where ?? this.defaultWhere);
        return plainToInstance(this.dtoClass, entity, { excludeExtraneousValues: false });
    }

    async update(
        id: string,
        updateDto: TUpdateDto,
        where?: FindOptionsWhere<TEntity>
    ): Promise<TDto> {
        const entity = await this.findEntityById(id, where ?? this.defaultWhere);

        // const updatedEntity = this.repository.merge(entity, updateDto);
        Object.assign(entity, updateDto);
        const updatedEntity = await this.repository.save(entity);

        return plainToInstance(this.dtoClass, updatedEntity, { excludeExtraneousValues: false });
    }

    async remove(
        id: string,
        where?: FindOptionsWhere<TEntity>
    ): Promise<void> {
        const entity = await this.findEntityById(id, where ?? this.defaultWhere);
        await this.repository.remove(entity);
    }

    async findByEntity(
        entityIds: string[],
        entityType?: string
    ): Promise<Record<string, TEntity[]>> {
        throw new InternalServerErrorException(
            'findByEntity must be implemented in a derived class.'
        );
    }

    protected async findEntityById(
        id?: string,
        where?: FindOptionsWhere<TEntity>
    ): Promise<TEntity> {

        const findConditions: FindOptionsWhere<TEntity> = {
            [this.entityPrimaryKey]: id,
            ...(where ?? this.defaultWhere),
        };

        const entity = await this.repository.findOne({ where: findConditions });

        if (!entity) {
            throw new NotFoundException(`Entity with ID ${id} not found`);
        }

        return entity;
    }
}