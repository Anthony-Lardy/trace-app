import * as Joi from 'joi';

import { env, validate } from '@lib/env-validator';

export class ConfigBucket {

    @env(Joi.number().required())
    public readonly PORT: string;

    @env(Joi.string().required())
    public readonly JWT_SECRET: string;

    @env(Joi.string().required())
    public readonly MONGO_URL: string;

    @env(Joi.string().required())
    public readonly ENVIRONMENT: 'preprod' | 'prod';
}

export const conf: ConfigBucket = validate<ConfigBucket>(ConfigBucket);
