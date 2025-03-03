import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

// aws
import { AwsSnsService } from '../sns/aws-sns.service';

@Controller()
export class AwsMessagingController {
    constructor(private readonly snsService: AwsSnsService) { }

    @MessagePattern('sns.publish')
    async publishMessage(@Payload() data: { message: string; attributes?: Record<string, any> }) {
        return this.snsService.publishMessage(data.message, data.attributes);
    }
}