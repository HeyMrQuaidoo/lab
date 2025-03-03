import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// config
import { ClientConfigModule } from 'apps/common/config';

// module
import { AwsModule } from './core/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AwsModule,
    ClientConfigModule
  ],
  controllers: [],
  providers: [],
})
export class AWSAppModule { }