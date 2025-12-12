import Joi from 'joi';

export const rucheValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    rucherId: Joi.number().optional(),
    queenInfo: Joi.string().optional(),
    geom: Joi.any().optional(), // GeoJSON or WKT
    active: Joi.boolean().optional(),
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    rucherId: Joi.number().optional(),
    queenInfo: Joi.string().optional(),
    geom: Joi.any().optional(),
    active: Joi.boolean().optional(),
  }),
};

export const rucherValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    geom: Joi.any().optional(), // GeoJSON or WKT for polygon
    active: Joi.boolean().optional(),
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    geom: Joi.any().optional(),
    active: Joi.boolean().optional(),
  }),
};

export const measurementValidation = {
  create: Joi.object({
    weight: Joi.number().min(0).optional(),
    temperature: Joi.number().min(-50).max(100).optional(),
    humidity: Joi.number().min(0).max(100).optional(),
    signal: Joi.number().optional(),
    raw: Joi.object().optional(), // JSONB
    recordedAt: Joi.date().optional(),
  }),
};

export const alertRuleValidation = {
  create: Joi.object({
    rucheId: Joi.number().optional(),
    ruleType: Joi.string().required(),
    params: Joi.object().required(), // JSONB
    notifyInApp: Joi.boolean().optional(),
    notifyWhatsapp: Joi.boolean().optional(),
    whatsappNumber: Joi.string().optional(),
    active: Joi.boolean().optional(),
  }),
  update: Joi.object({
    rucheId: Joi.number().optional(),
    ruleType: Joi.string().optional(),
    params: Joi.object().optional(),
    notifyInApp: Joi.boolean().optional(),
    notifyWhatsapp: Joi.boolean().optional(),
    whatsappNumber: Joi.string().optional(),
    active: Joi.boolean().optional(),
  }),
};
