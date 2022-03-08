import { CreateSessionModule } from '@src/app/session/createSession/createSession.module';
import { DeleteSessionModule } from '@src/app/session/deleteSession/deleteSession.module';
import { ListConsumerSessionsModule } from '@src/app/session/listConsumerSessions/listConsumerSession.module';
import { ListSessionsModule } from '@src/app/session/listSessions/listSessions.module';
import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { UpdateConsumerSessionModule } from '@src/app/session/updateConsumerSession/updateConsumerSession.module';
import { UpdateSessionModule } from '@src/app/session/updateSession/updateSession.module';

@Module({
    imports: [
        CreateSessionModule,
        DeleteSessionModule,
        ListSessionsModule,
        ListConsumerSessionsModule,
        UpdateSessionModule,
        UpdateConsumerSessionModule,
    ],
    controllers: [SessionController],
})
export class SessionModule {}
