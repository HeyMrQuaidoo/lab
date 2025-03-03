import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// contracts
import {
    TRANS_PATTERN,
    TransDto as ClientTransDto,
    CreateTransDto as ClientCreateTransDto,
    UpdateTransDto as ClientUpdateTransDto
  } from '@app/contracts';

// constants
import { RESOURCE_CLIENT } from 'apps/api-gateway/src/common/utils/constants';

  // dto
import { CreateTransDto } from './dto/create-trans.dto';
import { UpdateTransDto } from './dto/update-trans.dto';

// service
import { CrudService } from 'apps/api-gateway/src/common/service/crud-impl.service';
import { BaseService } from 'apps/api-gateway/src/common/service/base-impl-crud.service';

@Injectable()
export class TransService extends BaseService<
  any,
  CreateTransDto,
  UpdateTransDto,
  ClientTransDto,
  ClientCreateTransDto,
  ClientUpdateTransDto,
  null,
  null
> {
  constructor(@Inject(RESOURCE_CLIENT) transClient: ClientProxy) {
    super(
      'trans_id',
      transClient,
      new CrudService(
        'trans_id',
        transClient,
        {
          ...TRANS_PATTERN,
          LINK_ENTITY: '',
          DELETE_BY_ENTITY: ''
        },
        null,
        []
      )
    );
  }
}