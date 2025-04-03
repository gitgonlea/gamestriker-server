"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = require("joi");
exports.validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(3000),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(3306),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    SERVER_UPDATE_INTERVAL: Joi.number(),
    SERVER_QUERY_TIMEOUT: Joi.number(),
    BANNER_OUTPUT_PATH: Joi.string(),
});
//# sourceMappingURL=validation.schema.js.map