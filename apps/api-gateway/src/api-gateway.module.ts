import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

// config
import { ClientConfigModule } from 'apps/common/config';

// controllers
import { ApiGatewayController } from './api-gateway.controller';

// services
import { ApiGatewayService } from './api-gateway.service';

// modules
import { ResourceModule } from './resources/resources.module';

@Module({
  imports: [
    ClientConfigModule,
    ResourceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RouterModule.register([
      {
        path: 'resources',
        module: ResourceModule,
      }
    ]),
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})

export class ApiGatewayModule { }