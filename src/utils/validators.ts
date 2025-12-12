import Joi from 'joi';

/**
 * Common validation schemas using Joi
 */

// UUID validation for params
export const uuidSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

// UUID validation for params with ruche_id
export const uuidWithRucheSchema = Joi.object({
  id: Joi.string().uuid().required(),
  ruche_id: Joi.string().uuid().required(),
});

// Coordinate validation
const coordinateSchema = Joi.array().items(Joi.number()).length(2).required();

// Point geometry validation (GeoJSON)
export const pointGeometrySchema = Joi.object({
  type: Joi.string().valid('Point').required(),
  coordinates: coordinateSchema,
});

// Polygon geometry validation (GeoJSON)
export const polygonGeometrySchema = Joi.object({
  type: Joi.string().valid('Polygon').required(),
  coordinates: Joi.array().items(Joi.array().items(coordinateSchema).min(4)).min(1).required(),
});

// Ruche (Hive) validation schemas
export const createRucheSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null).optional(),
  location: pointGeometrySchema.required(),
  rucher_id: Joi.string().uuid().allow(null).optional(),
  hive_type: Joi.string().max(100).allow('', null).optional(),
  installation_date: Joi.date().iso().allow(null).optional(),
  active: Joi.boolean().optional().default(true),
});

export const updateRucheSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  location: pointGeometrySchema.optional(),
  rucher_id: Joi.string().uuid().allow(null).optional(),
  hive_type: Joi.string().max(100).allow('', null).optional(),
  installation_date: Joi.date().iso().allow(null).optional(),
  active: Joi.boolean().optional(),
}).min(1);

// Rucher (Apiary) validation schemas
export const createRucherSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null).optional(),
  location: polygonGeometrySchema.required(),
  user_id: Joi.string().uuid().allow(null).optional(),
  active: Joi.boolean().optional().default(true),
});

export const updateRucherSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  location: polygonGeometrySchema.optional(),
  user_id: Joi.string().uuid().allow(null).optional(),
  active: Joi.boolean().optional(),
}).min(1);

// Measurement validation schema
export const createMeasurementSchema = Joi.object({
  weight: Joi.number().precision(2).allow(null).optional(),
  temperature: Joi.number().precision(2).allow(null).optional(),
  humidity: Joi.number().precision(2).min(0).max(100).allow(null).optional(),
  battery_level: Joi.number().precision(2).min(0).max(100).allow(null).optional(),
  timestamp: Joi.date().iso().optional(),
});

// Alert rule validation schema
export const createAlertRuleSchema = Joi.object({
  name: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('', null).optional(),
  ruche_id: Joi.string().uuid().allow(null).optional(),
  rucher_id: Joi.string().uuid().allow(null).optional(),
  metric: Joi.string().valid('weight', 'temperature', 'humidity', 'battery_level').required(),
  operator: Joi.string().valid('>', '<', '>=', '<=', '==', '!=').required(),
  threshold: Joi.number().precision(2).required(),
  active: Joi.boolean().optional().default(true),
}).or('ruche_id', 'rucher_id');

export const updateAlertRuleSchema = Joi.object({
  name: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow('', null).optional(),
  metric: Joi.string().valid('weight', 'temperature', 'humidity', 'battery_level').optional(),
  operator: Joi.string().valid('>', '<', '>=', '<=', '==', '!=').optional(),
  threshold: Joi.number().precision(2).optional(),
  active: Joi.boolean().optional(),
}).min(1);

// Query parameter validation schemas
export const listRuchesQuerySchema = Joi.object({
  active: Joi.boolean().optional(),
  rucher_id: Joi.string().uuid().optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  radius: Joi.number().min(0).optional(),
  limit: Joi.number().integer().min(1).max(100).optional().default(50),
  offset: Joi.number().integer().min(0).optional().default(0),
});

export const listRuchersQuerySchema = Joi.object({
  active: Joi.boolean().optional(),
  user_id: Joi.string().uuid().optional(),
  limit: Joi.number().integer().min(1).max(100).optional().default(50),
  offset: Joi.number().integer().min(0).optional().default(0),
});

export const measurementsQuerySchema = Joi.object({
  start_date: Joi.date().iso().optional(),
  end_date: Joi.date().iso().optional(),
  limit: Joi.number().integer().min(1).max(1000).optional().default(100),
  offset: Joi.number().integer().min(0).optional().default(0),
});

export const analyticsQuerySchema = Joi.object({
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().required(),
});

// Manage ruche in rucher validation schema
export const manageRucheSchema = Joi.object({
  action: Joi.string().valid('add', 'remove').required(),
});
