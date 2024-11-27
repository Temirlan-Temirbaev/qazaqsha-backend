import { Module } from '@nestjs/common';
import { DataServiceModule } from './services/data-service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheServiceModule } from './services/cache-services';
import { FileServiceModule } from './services/file-service';
import { JwtModule } from '@nestjs/jwt';
import { UserUseCasesModule } from './use-cases/user/user.use-cases.module';
import { UserController } from './controllers/user.controller';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './use-cases/user/guards/accessToken.guard';
import { AdminUseCasesModule } from './use-cases/admin/admin.use-cases.module';
import { AdminController } from './controllers/admin.controller';
import { TeacherController } from './controllers/teacher.controller';
import { TeacherUseCasesModule } from './use-cases/teacher/teacher.use-cases.module';
import { AssignmentUseCasesModule } from './use-cases/assignment/assignment.use-cases.module';
import { QuestionUseCasesModule } from './use-cases/question/question.use-cases.module';
import { AnswerUseCasesModule } from './use-cases/answer/answer.use-cases.module';
import { AssignmentController } from './controllers/assignment.controller';
import { QuestionController } from './controllers/question.controller';
import { AnswerController } from './controllers/answer.controller';
import { ReplyUseCasesModule } from './use-cases/reply/reply.use-cases.module';
import { ReplyController } from './controllers/reply.controller';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    DataServiceModule,
    CacheServiceModule,
    FileServiceModule,
    UserUseCasesModule,
    AdminUseCasesModule,
    TeacherUseCasesModule,
    AssignmentUseCasesModule,
    QuestionUseCasesModule,
    AnswerUseCasesModule,
    ReplyUseCasesModule,
  ],
  controllers: [
    UserController,
    AppController,
    AdminController,
    TeacherController,
    AssignmentController,
    QuestionController,
    AnswerController,
    ReplyController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
