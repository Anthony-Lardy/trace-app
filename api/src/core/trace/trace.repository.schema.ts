import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TraceAction, TraceSource } from './trace.interface';

@Schema()
export class Trace extends Document {
    @Prop({ type: String, _id: false })
    public _id: string;
    public __v: number;

    @Prop({ required: true })
    public action: TraceAction;

    @Prop({ required: true })
    public source: TraceSource;

    @Prop()
    public payload: string;

    @Prop()
    public activity: string;

    @Prop()
    public student: string;

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

export const TraceMongoSchema = SchemaFactory.createForClass(Trace);