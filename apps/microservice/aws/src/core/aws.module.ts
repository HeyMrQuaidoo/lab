import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// aws
import { AwsSnsService } from '../sns/aws-sns.service';
import { AwsSqsService } from '../sqs/aws-sqs.service';
import { AwsParamStoreService } from '../param-store/aws-param-store.service';

@Module({
  imports: [ConfigModule],
  providers: [AwsSnsService, AwsSqsService, AwsParamStoreService],
  exports: [AwsSnsService, AwsSqsService, AwsParamStoreService],
})

export class AwsModule {}