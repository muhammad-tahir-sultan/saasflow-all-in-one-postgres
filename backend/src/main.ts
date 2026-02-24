import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // CORS
    const corsOrigins = process.env.CORS_ORIGIN
        ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
        : ['http://localhost:3000'];

    app.enableCors({
        origin: corsOrigins,
        credentials: true,
    });

    // Global prefix
    app.setGlobalPrefix('api');

    // Global filters & interceptors
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    // WebSocket adapter
    app.useWebSocketAdapter(new IoAdapter(app));

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 SaaSFlow backend running on http://localhost:${port}`);
}

bootstrap();
