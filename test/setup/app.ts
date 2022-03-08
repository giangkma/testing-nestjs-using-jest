import { AppModule } from '@src/app.module';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { getConnection } from 'typeorm';

export async function setupTestApp() {
    const moduleRef = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();
    const app = moduleRef.createNestApplication();
    await app.useGlobalPipes(new ValidationPipe({ transform: true }));
    // get the connection from the app
    await getConnection().synchronize(true); // here the true is for `dropBeforeSync`
    await app.init();
    return app;
}
