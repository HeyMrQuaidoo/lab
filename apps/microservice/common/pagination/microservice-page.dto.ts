import { ApiProperty } from '@nestjs/swagger';

// page-meta
import { MicroservicePageMetaDto } from './microservice-page-meta.dto';

export class MicroservicePageDto<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly meta: MicroservicePageMetaDto;

  constructor(data: T[], meta: MicroservicePageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
