import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class ApiGatewayService {
    constructor(@Inject('SNS_MICROSERVICE') private readonly snsClient: ClientProxy) { }

    async notifyOrderCreated(orderId: string) {
        await this.snsClient.send('sns.publish', {
            topicArn: process.env.AWS_SNS_TOPIC_ARN,
            message: `Order ${orderId} has been created!`,
        }).toPromise();
    }
}