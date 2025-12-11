import Joi from 'joi';

export const rucheValidation = {
  create: Joi.object({
    name: Joi.string().required().max(100),
    location: Joi.string().required().max(255),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    description: Joi.string().optional(),
    hiveType: Joi.string().max(50).optional(),
    installationDate: Joi.date().optional(),
    status: Joi.string().valid('active', 'inactive', 'maintenance').optional(),
    userId: Joi.number().optional(),
    rucherId: Joi.number().optional(),
  }),
  update: Joi.object({
    name: Joi.string().max(100).optional(),
    location: Joi.string().max(255).optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    description: Joi.string().optional(),
    hiveType: Joi.string().max(50).optional(),
    installationDate: Joi.date().optional(),
    status: Joi.string().valid('active', 'inactive', 'maintenance').optional(),
    userId: Joi.number().optional(),
    rucherId: Joi.number().optional(),
  }),
};

export const rucherValidation = {
  create: Joi.object({
    name: Joi.string().required().max(100),
    location: Joi.string().required().max(255),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    description: Joi.string().optional(),
    userId: Joi.number().optional(),
  }),
  update: Joi.object({
    name: Joi.string().max(100).optional(),
    location: Joi.string().max(255).optional(),
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional(),
    description: Joi.string().optional(),
    userId: Joi.number().optional(),
  }),
};

export const measurementValidation = {
  create: Joi.object({
    weight: Joi.number().min(0).optional(),
    temperature: Joi.number().min(-50).max(100).optional(),
    humidity: Joi.number().min(0).max(100).optional(),
    signalStrength: Joi.number().optional(),
    batteryLevel: Joi.number().min(0).max(100).optional(),
    timestamp: Joi.date().optional(),
  }),
};

export const alertRuleValidation = {
  create: Joi.object({
    name: Joi.string().required().max(100),
    rucheId: Joi.number().optional(),
    rucherId: Joi.number().optional(),
    alertType: Joi.string().valid('weight', 'temperature', 'humidity', 'variation').required(),
    condition: Joi.string().valid('greater_than', 'less_than', 'equals', 'between').required(),
    threshold: Joi.number().optional(),
    thresholdMin: Joi.number().optional(),
    thresholdMax: Joi.number().optional(),
    enabled: Joi.boolean().optional(),
    userId: Joi.number().optional(),
  }),
  update: Joi.object({
    name: Joi.string().max(100).optional(),
    rucheId: Joi.number().optional(),
    rucherId: Joi.number().optional(),
    alertType: Joi.string().valid('weight', 'temperature', 'humidity', 'variation').optional(),
    condition: Joi.string().valid('greater_than', 'less_than', 'equals', 'between').optional(),
    threshold: Joi.number().optional(),
    thresholdMin: Joi.number().optional(),
    thresholdMax: Joi.number().optional(),
    enabled: Joi.boolean().optional(),
    userId: Joi.number().optional(),
  }),
};
