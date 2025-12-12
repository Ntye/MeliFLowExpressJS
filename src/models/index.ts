import { Ruche } from './Ruche';
import { Rucher } from './Rucher';
import { Measurement } from './Measurement';
import { AlertRule } from './AlertRule';
import { Alert } from './TriggeredAlert';

// Rucher associations
Rucher.hasMany(Ruche, { foreignKey: 'rucherId', as: 'ruches' });

// Ruche associations
Ruche.belongsTo(Rucher, { foreignKey: 'rucherId', as: 'rucher' });
Ruche.hasMany(Measurement, { foreignKey: 'rucheId', as: 'measurements' });
Ruche.hasMany(AlertRule, { foreignKey: 'rucheId', as: 'alertRules' });
Ruche.hasMany(Alert, { foreignKey: 'rucheId', as: 'alerts' });

// Measurement associations
Measurement.belongsTo(Ruche, { foreignKey: 'rucheId', as: 'ruche' });

// AlertRule associations
AlertRule.belongsTo(Ruche, { foreignKey: 'rucheId', as: 'ruche' });
AlertRule.hasMany(Alert, { foreignKey: 'ruleId', as: 'alerts' });

// Alert associations
Alert.belongsTo(AlertRule, { foreignKey: 'ruleId', as: 'alertRule' });
Alert.belongsTo(Ruche, { foreignKey: 'rucheId', as: 'ruche' });

export { Ruche, Rucher, Measurement, AlertRule, Alert };
