import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ClientProxyFactory } from '@nestjs/microservices';

// constants
import { AWS, RESOURCE } from 'apps/common/config/constants';
import { AWS_CLIENT, RESOURCE_CLIENT } from '../common/utils/constants';

// config
import { ClientConfigModule, ClientConfigService } from 'apps/common/config';

// helpers
import { appendSubPathsToBaseModule } from 'apps/common/utils/helpers';

// module
import { MediaModule } from './modules/media/media.module';
import { TransModule } from './modules/trans/trans.module';

// services
import { ResourceService } from './resources.service';

// controller
import { ResourceController } from './resources.controller';


@Module({
  imports: [
    ClientConfigModule,
    MediaModule,
    TransModule,
    RouterModule.register([
      {
        path: '',
        children: [
          ...appendSubPathsToBaseModule('/', [MediaModule, TransModule]),
        ],
      },
    ]),
  ],
  controllers: [ResourceController],
  providers: [ResourceService,
    {
      provide: RESOURCE_CLIENT,
      useFactory(configService: ClientConfigService) {
        return ClientProxyFactory.create(configService.getClientOptions(RESOURCE));
      },
      inject: [ClientConfigService]
    },
    {
      provide: AWS_CLIENT,
      useFactory(configService: ClientConfigService) {
        return ClientProxyFactory.create(configService.getClientOptions(AWS));
      },
      inject: [ClientConfigService]
    }
  ],
})

export class ResourceModule { }