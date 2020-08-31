import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Group extends Document {
    @Prop({ type: String, _id: false })
    public _id: string;
    public __v: number;

    @Prop({ required: true })
    public name: string;

    @Prop()
    public course: string;

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

export const GroupMongoSchema = SchemaFactory.createForClass(Group);