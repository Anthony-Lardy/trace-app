import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { convertToMongoUpdate } from '@lib/helper';
import { generateId } from '@lib/id-provider';
import { Trace } from './trace.interface';
import { Trace as TraceMongo } from './trace.repository.schema';

@Injectable()
export class TraceRepository {

    private readonly errors: Array<{matcher: RegExp, error: string}> = [
        {
            matcher: /duplicate key error.*email/,
            error: 'Email already used.'
        },
    ];
    constructor(@InjectModel(TraceMongo.name) private readonly traceModel: Model<TraceMongo>) {
    }

    public async findOne(query: object): Promise<Trace | null> {
        const trace = await this.traceModel.findOne(query).exec();
        return trace && this.fromMongo(trace);
    }

    public async findByIdentifier(identifier: string): Promise<Trace | null> {        
        const trace = await this.traceModel.findById(identifier).exec();
        return trace && this.fromMongo(trace);
    }

    public async createTrace(trace: Partial<Trace>): Promise<Trace> {
        try {
            const id = await this.nextGeneratedId();
            const createdTrace = new this.traceModel({
                ...trace,
                _id: id,
            });
            const traceCreated = await createdTrace.save();
            return this.fromMongo(traceCreated);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async updateTrace(id: string, trace: Partial<Trace>): Promise<Trace | null> {
        try {
            const res = await this.traceModel.findByIdAndUpdate(id, convertToMongoUpdate(trace), {new: true}).exec();
            return res && this.fromMongo(res);
        } catch (error) {
            throw new BadRequestException(...this.errorManager(error));
        }
    }

    public async countTraces(query: object): Promise<number> {
        return this.traceModel.count(query).exec();
    }

    public async findAll(query: object, options: { limit?: number, fields?: object, skip?: number, sort?: object }): Promise<Trace[]> {
        const traces = await this.traceModel
            .find(query, options.fields)
            .limit(options.limit || 1000)
            .skip(options.skip || 0)
            .sort(options.sort).exec();
        return traces.map(this.fromMongo);
    }
    
    private fromMongo(data: TraceMongo): Trace {
        const {__v, _id,  ...obj} = data.toObject();
        return {
            ...obj,
            id: `${_id}`,
        };
    }

    private async nextGeneratedId(): Promise<string> {
        const id = generateId('traces');
        const existing = await this.traceModel.findById(id).exec();

        if (existing) {
            return this.nextGeneratedId();
        }

        return id;
    }

    private errorManager(error): any {
        const match = this.errors.find(({ matcher }) => matcher.exec(error?.message));
        if (match) {
            return [match.error];
        }
        return [error, error.message];
    }

}
