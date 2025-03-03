import { ApiOperation } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class ApiGatewayController {
  constructor() { }

  @Get("auth.onboarding")
  @ApiOperation({ summary: 'Email Test' })
  async sendOnboardingEmail(): Promise<{}> {
    try {

      return { "message": "Email sent successfully" };
    } catch (error) {
      throw new Error("Failed to send email");
    }
  }
}