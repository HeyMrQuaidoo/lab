import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';

// constants
import { AWS } from 'apps/common/config/constants';

// modules
import { AWSAppModule } from './aws-app.module';

// services
import { ClientConfigService } from 'apps/common/config/client-config.service';


async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AWSAppModule);
  const clientConfigService = appContext.get(ClientConfigService);
  const clientOptions = clientConfigService.getClientOptions(AWS);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AWSAppModule,
    clientOptions
  );

  await app.listen();
}

bootstrap();