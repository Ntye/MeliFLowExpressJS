/**
 * Database models and associations
 */
import User from './User';
import Rucher from './Rucher';
import Ruche from './Ruche';
import Measurement from './Measurement';
import AlertRule from './AlertRule';
import Alert from './Alert';

/**
 * Define model associations
 */

// User has many Ruchers
User.hasMany(Rucher, {
  foreignKey: 'user_id',
  as: 'ruchers',
});
Rucher.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

// Rucher has many Ruches
Rucher.hasMany(Ruche, {
  foreignKey: 'rucher_id',
  as: 'ruches',
});
Ruche.belongsTo(Rucher, {
  foreignKey: 'rucher_id',
  as: 'rucher',
});

// Ruche has many Measurements
Ruche.hasMany(Measurement, {
  foreignKey: 'ruche_id',
  as: 'measurements',
});
Measurement.belongsTo(Ruche, {
  foreignKey: 'ruche_id',
  as: 'ruche',
});

// Ruche has many AlertRules
Ruche.hasMany(AlertRule, {
  foreignKey: 'ruche_id',
  as: 'alert_rules',
});
AlertRule.belongsTo(Ruche, {
  foreignKey: 'ruche_id',
  as: 'ruche',
});

// Rucher has many AlertRules
Rucher.hasMany(AlertRule, {
  foreignKey: 'rucher_id',
  as: 'alert_rules',
});
AlertRule.belongsTo(Rucher, {
  foreignKey: 'rucher_id',
  as: 'rucher',
});

// AlertRule has many Alerts
AlertRule.hasMany(Alert, {
  foreignKey: 'alert_rule_id',
  as: 'alerts',
});
Alert.belongsTo(AlertRule, {
  foreignKey: 'alert_rule_id',
  as: 'alert_rule',
});

// Ruche has many Alerts
Ruche.hasMany(Alert, {
  foreignKey: 'ruche_id',
  as: 'alerts',
});
Alert.belongsTo(Ruche, {
  foreignKey: 'ruche_id',
  as: 'ruche',
});

// Measurement has many Alerts
Measurement.hasMany(Alert, {
  foreignKey: 'measurement_id',
  as: 'alerts',
});
Alert.belongsTo(Measurement, {
  foreignKey: 'measurement_id',
  as: 'measurement',
});

export { User, Rucher, Ruche, Measurement, AlertRule, Alert };
