import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// constants
import { RESOURCE_CLIENT } from 'apps/api-gateway/src/common/utils/constants';

// contracts
import {
  MEDIA_PATTERN,
  MediaDto as ClientMediaDto,
  CreateMediaDto as ClientCreateMediaDto,
  UpdateMediaDto as ClientUpdateMediaDto
} from '@app/contracts';

// dto
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

// service
import { CrudService } from 'apps/api-gateway/src/common/service/crud-impl.service';
import { BaseService } from 'apps/api-gateway/src/common/service/base-impl-crud.service';



@Injectable()
export class MediaService extends BaseService<
  any,
  CreateMediaDto,
  UpdateMediaDto,
  ClientMediaDto,
  ClientCreateMediaDto,
  ClientUpdateMediaDto,
  null,
  null
> {
  constructor(@Inject(RESOURCE_CLIENT) mediaClient: ClientProxy) {
    super(
      'media_id',
      mediaClient,
      new CrudService(
        'media_id',
        mediaClient,
        {
          ...MEDIA_PATTERN,
          LINK_ENTITY: '',
          DELETE_BY_ENTITY: ''
        },
        null,
        []
      )
    );
  }
}

