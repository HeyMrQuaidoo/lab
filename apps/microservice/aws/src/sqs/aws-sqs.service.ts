import { SQS } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AwsSqsService implements OnModuleInit {
    private sqs: SQS;
    private queueUrl: string;

    constructor(private readonly configService: ConfigService) {
        this.queueUrl = this.configService.get<string>('AWS_SQS_QUEUE_URL');
        this.sqs = new SQS({ region: this.configService.get<string>('AWS_REGION') });
    }

    async onModuleInit() {
        this.startPolling();
    }

    private async startPolling() {
        setInterval(async () => {
            try {
                const params: SQS.ReceiveMessageRequest = {
                    QueueUrl: this.queueUrl,
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 20,
                };
                const messages = await this.sqs.receiveMessage(params).promise();

                if (messages.Messages) {
                    for (const message of messages.Messages) {
                        console.log(`📩 Received SQS Message: ${message.Body}`);
                        await this.processMessage(message);
                        await this.deleteMessage(message.ReceiptHandle);
                    }
                }
            } catch (error) {
                console.error('❌ Error receiving messages from SQS:', error);
            }
        }, 5000);
    }

    private async processMessage(message: SQS.Message) {
        console.log(`📌 Processing message: ${message.Body}`);
    }

    private async deleteMessage(receiptHandle: string) {
        try {
            await this.sqs.deleteMessage({ QueueUrl: this.queueUrl, ReceiptHandle: receiptHandle }).promise();
            console.log(`🗑️ Message deleted from queue`);
        } catch (error) {
            console.error('❌ Error deleting message from SQS:', error);
        }
    }
}
