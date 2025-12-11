import { User } from './User';
import { Ruche } from './Ruche';
import { Rucher } from './Rucher';
import { Measurement } from './Measurement';
import { AlertRule } from './AlertRule';
import { TriggeredAlert } from './TriggeredAlert';

// User associations
User.hasMany(Ruche, { foreignKey: 'userId', as: 'ruches' });
User.hasMany(Rucher, { foreignKey: 'userId', as: 'ruchers' });
User.hasMany(AlertRule, { foreignKey: 'userId', as: 'alertRules' });

// Rucher associations
Rucher.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Rucher.hasMany(Ruche, { foreignKey: 'rucherId', as: 'ruches' });

// Ruche associations
Ruche.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Ruche.belongsTo(Rucher, { foreignKey: 'rucherId', as: 'rucher' });
Ruche.hasMany(Measurement, { foreignKey: 'rucheId', as: 'measurements' });
Ruche.hasMany(AlertRule, { foreignKey: 'rucheId', as: 'alertRules' });
Ruche.hasMany(TriggeredAlert, { foreignKey: 'rucheId', as: 'triggeredAlerts' });

// Measurement associations
Measurement.belongsTo(Ruche, { foreignKey: 'rucheId', as: 'ruche' });
Measurement.hasMany(TriggeredAlert, { foreignKey: 'measurementId', as: 'triggeredAlerts' });

// AlertRule associations
AlertRule.belongsTo(User, { foreignKey: 'userId', as: 'user' });
AlertRule.belongsTo(Ruche, { foreignKey: 'rucheId', as: 'ruche' });
AlertRule.belongsTo(Rucher, { foreignKey: 'rucherId', as: 'rucher' });
AlertRule.hasMany(TriggeredAlert, { foreignKey: 'alertRuleId', as: 'triggeredAlerts' });

// TriggeredAlert associations
TriggeredAlert.belongsTo(AlertRule, { foreignKey: 'alertRuleId', as: 'alertRule' });
TriggeredAlert.belongsTo(Ruche, { foreignKey: 'rucheId', as: 'ruche' });
TriggeredAlert.belongsTo(Measurement, { foreignKey: 'measurementId', as: 'measurement' });

export { User, Ruche, Rucher, Measurement, AlertRule, TriggeredAlert };
