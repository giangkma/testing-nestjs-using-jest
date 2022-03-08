import { Module } from '@nestjs/common';
import { SessionRepository } from '@src/infra/session/session.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateSessionUseCase } from './updateSession.usecase';

@Module({
    imports: [TypeOrmModule.forFeature([SessionRepository])],
    providers: [UpdateSessionUseCase],
    exports: [UpdateSessionUseCase],
})
export class UpdateSessionModule {}
