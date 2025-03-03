import { SNS } from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// aws
import { AwsParamStoreService } from '../param-store/aws-param-store.service';

@Injectable()
export class AwsSnsService {
    private sns: SNS;
    private topicArn: string | null = null;

    constructor(
        private readonly configService: ConfigService,
        private readonly paramStoreService: AwsParamStoreService
    ) {
        this.sns = new SNS({ region: this.configService.get<string>('AWS_REGION') });

        // Fetch Topic ARN at startup
        this.init();
    }

    private async init() {
        this.topicArn = await this.paramStoreService.getParameter('/my-app/sns-topic-arn');
    }

    async publishMessage(message: string, attributes?: Record<string, any>) {
        if (!this.topicArn) {
            throw new Error('❌ SNS Topic ARN is not set in Parameter Store!');
        }

        const params: SNS.PublishInput = {
            Message: message,
            TopicArn: this.topicArn,
            MessageAttributes: attributes ? this.formatAttributes(attributes) : undefined,
        };


        try {
            const response = await this.sns.publish(params).promise();
            console.log(`✅ Message published to SNS: ${response.MessageId}`);
            return response.MessageId;
        } catch (error) {
            console.error('❌ Error publishing message to SNS:', error);
            throw error;
        }
    }

    private formatAttributes(attributes: Record<string, any>) {
        return Object.entries(attributes).reduce((acc, [key, value]) => {
            acc[key] = { DataType: typeof value === 'number' ? 'Number' : 'String', StringValue: value.toString() };
            return acc;
        }, {} as Record<string, SNS.MessageAttributeValue>);
    }
}
