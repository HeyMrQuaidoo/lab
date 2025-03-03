import { SSM } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AwsParamStoreService {
    private readonly ssm: SSM;
    private readonly logger = new Logger(AwsParamStoreService.name);

    constructor(private readonly configService: ConfigService) {
        this.ssm = new SSM({ region: this.configService.get<string>('AWS_REGION') });
    }

    async getParameter(name: string, withDecryption = false): Promise<string | null> {
        try {
            const response = await this.ssm
                .getParameter({ Name: name, WithDecryption: withDecryption })
                .promise();

            return response.Parameter?.Value ?? null;
        } catch (error) {
            this.logger.error(`❌ Failed to fetch parameter ${name}:`, error.message);
            return null;
        }
    }

    async getParameters(names: string[], withDecryption = false): Promise<Record<string, string | null>> {
        try {
            const response = await this.ssm
                .getParameters({ Names: names, WithDecryption: withDecryption })
                .promise();

            const params: Record<string, string | null> = {};
            for (const param of response.Parameters ?? []) {
                params[param.Name] = param.Value ?? null;
            }

            return params;
        } catch (error) {
            this.logger.error(`❌ Failed to fetch parameters:`, error.message);
            return {};
        }
    }
}
