import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// module
import { ApiGatewayModule } from './api-gateway.module';

// guards
// import { PassportJwtAuthGuard } from './auth/guards/passport-jwt.guard';

// filters
import { GlobalResponseInterceptor } from 'apps/common/interceptors/global.interceptor';
import { GlobalExceptionFilter } from 'apps/common/filters/global-http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('0.0.0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const reflector = app.get(Reflector);

  // filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // response interceptor
  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  // auth guards
  // app.useGlobalGuards(new PassportJwtAuthGuard(reflector));

  // validation pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // enable CORS
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    allowedHeaders: ['Content-Type', 'Authorization', '*'],
    credentials: true
  };
  app.enableCors(corsOptions);

  await app.listen(process.env.port ?? 3000);
}
bootstrap();