import { Module } from '@nestjs/common';
import { MemberController } from './infrastructure/controllers/member.controller';
import { FirestoreMemberRepository } from './infrastructure/repositories/firestore-member.repository';
import { InMemoryMemberRepository } from './infrastructure/repositories/in-memory-member.repository';
import { ConfigModule } from '@nestjs/config';
import { CreateMemberUseCase } from './application/use-cases/create-member.use-case';
import { GetMemberByIdUseCase } from './application/use-cases/get-member-by-id.use-case';
import { GetAllMembersUseCase } from './application/use-cases/get-all-members.use-case';
import { UpdateMemberUseCase } from './application/use-cases/update-member.use-case';
import { DeleteMemberUseCase } from './application/use-cases/delete-member.use-case';
import { GetAllMembersByClientIdUseCase } from './application/use-cases/get-all-members-by-client-id.use-case';

// Token para la inyección de dependencias
export const MEMBER_REPOSITORY = 'MemberRepository';

@Module({
  imports: [
    ConfigModule.forRoot(),
  ],
  controllers: [MemberController],
  providers: [
    // Repositorio
    {
      provide: MEMBER_REPOSITORY,
      useClass: FirestoreMemberRepository,
    },
    // Casos de uso
    {
      provide: CreateMemberUseCase,
      useFactory: (memberRepo) => new CreateMemberUseCase(memberRepo),
      inject: [MEMBER_REPOSITORY],
    },
    {
      provide: GetAllMembersUseCase,
      useFactory: (memberRepo) => new GetAllMembersUseCase(memberRepo),
      inject: [MEMBER_REPOSITORY],
    },
    {
      provide: GetMemberByIdUseCase,
      useFactory: (memberRepo) => new GetMemberByIdUseCase(memberRepo),
      inject: [MEMBER_REPOSITORY],
    },
    {
      provide: UpdateMemberUseCase,
      useFactory: (memberRepo) => new UpdateMemberUseCase(memberRepo),
      inject: [MEMBER_REPOSITORY],
    },
    {
      provide: DeleteMemberUseCase,
      useFactory: (memberRepo) => new DeleteMemberUseCase(memberRepo),
      inject: [MEMBER_REPOSITORY],
    },
    {
      provide: GetAllMembersByClientIdUseCase,
      useFactory: (memberRepo) => new GetAllMembersByClientIdUseCase(memberRepo),
      inject: [MEMBER_REPOSITORY],
    },
  ],
  exports: [MEMBER_REPOSITORY],
})
export class MembersModule {} 