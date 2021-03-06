import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
    @Prop({ type: String, _id: false })
    public _id: string;
    public __v: number;

    @Prop({ required: true })
    public firstName: string;

    @Prop({ required: true })
    public lastName: string;

    @Prop()
    public email: string;

    @Prop()
    public password: string;

    @Prop()
    public courses: string[];

    @Prop()
    public createdAt: Date;

    @Prop()
    public createdBy: string;

    @Prop()
    public updatedAt: Date;

    @Prop()
    public updatedBy: string;

    @Prop()
    public deletedAt: Date;

    @Prop()
    public deletedBy: string;
    
}

export const UserMongoSchema = SchemaFactory.createForClass(User);