import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { User as UserMongo, UserMongoSchema } from './user.repository.schema';
import { UserService } from './user.service';
import { CourseModule } from '@core/course/course.module';

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: UserMongo.name,
            useFactory: () => {
                const schema = UserMongoSchema;
                schema.index({ email: 1, deletedAt: 1 }, { unique: true, partialFilterExpression: { email: { $exists: true } }, collation: { locale: 'en', strength: 2 } });
                schema.index('fistName');
                schema.index('lastName');
                schema.index('courses');
                schema.index('createdAt');
                schema.index('createdBy');
                schema.index('updatedAt');
                schema.index('updatedBy');
                schema.index('deletedAt');
                schema.index('deletedBy');
                return schema;
            },
        },
    ]), forwardRef(() => CourseModule)],
    controllers: [UserController],
    providers: [UserRepository, UserService],
    exports: [UserService],
})
export class UserModule {
}
