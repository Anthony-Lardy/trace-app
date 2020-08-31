import * as joi from 'joi';
import 'reflect-metadata';

const envMetadataKey = Symbol('env');

export function env(schema: joi.Schema): (target: any, propertyKey: string) => void {
  return (target: any, propertyKey: string) => {
    // Build a list of env params
    const existingEnvParams = Reflect.getMetadata(envMetadataKey, target) || {};
    existingEnvParams[propertyKey] = schema;
    Reflect.defineMetadata(envMetadataKey, existingEnvParams, target);

    // property getter
    const getter = () => {
      return process.env[propertyKey];
    };

    // Affect new property.
    // tslint:disable-next-line:early-exit
    if (delete target[propertyKey]) {
      // Create new property with getter and setter
      Object.defineProperty(target, propertyKey, {
        get: getter,
        enumerable: true,
        configurable: true,
      });
    }
  };
}

export function validate<T>(configBucket: any): T {
    const objConfigBucket = typeof configBucket === 'function' ? new configBucket() : configBucket;
    const meta = Reflect.getMetadata(envMetadataKey, objConfigBucket);
    const values = Object.keys(meta).reduce((acc, key: string) => {
        acc[key] = process.env[key];
        return acc;
    }, {});

    const validationResult = joi.validate({ ...objConfigBucket, ...values }, meta, { abortEarly: false, allowUnknown: true });
    if (validationResult.error) {
        const details = validationResult.error.details.reduce((acc, detail) => {
            acc.push('Environment variable ' + detail.message);
            return acc;
        }, ['Invalid environment configuration']);
        throw new Error(details.join('\n'));
    }

    return Object.freeze(validationResult.value as T);
}
