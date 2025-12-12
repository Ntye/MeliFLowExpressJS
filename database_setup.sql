-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ruchers (apiaries) table with polygon geometry
CREATE TABLE IF NOT EXISTS ruchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOMETRY(Polygon, 4326) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index for ruchers
CREATE INDEX IF NOT EXISTS idx_ruchers_location ON ruchers USING GIST(location);

-- Create ruches (hives) table with point geometry
CREATE TABLE IF NOT EXISTS ruches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326) NOT NULL,
    rucher_id UUID REFERENCES ruchers(id) ON DELETE SET NULL,
    hive_type VARCHAR(100),
    installation_date DATE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create spatial index for ruches
CREATE INDEX IF NOT EXISTS idx_ruches_location ON ruches USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_ruches_rucher_id ON ruches(rucher_id);

-- Create measurements table for sensor data
CREATE TABLE IF NOT EXISTS measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ruche_id UUID NOT NULL REFERENCES ruches(id) ON DELETE CASCADE,
    weight DECIMAL(10, 2),
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    battery_level DECIMAL(5, 2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for measurements
CREATE INDEX IF NOT EXISTS idx_measurements_ruche_id ON measurements(ruche_id);
CREATE INDEX IF NOT EXISTS idx_measurements_timestamp ON measurements(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_measurements_ruche_timestamp ON measurements(ruche_id, timestamp DESC);

-- Create alert_rules table
CREATE TABLE IF NOT EXISTS alert_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ruche_id UUID REFERENCES ruches(id) ON DELETE CASCADE,
    rucher_id UUID REFERENCES ruchers(id) ON DELETE CASCADE,
    metric VARCHAR(100) NOT NULL,
    operator VARCHAR(20) NOT NULL,
    threshold DECIMAL(10, 2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_target CHECK (ruche_id IS NOT NULL OR rucher_id IS NOT NULL)
);

-- Create alerts table for triggered alerts
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_rule_id UUID NOT NULL REFERENCES alert_rules(id) ON DELETE CASCADE,
    ruche_id UUID REFERENCES ruches(id) ON DELETE CASCADE,
    measurement_id UUID REFERENCES measurements(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'info',
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for alerts
CREATE INDEX IF NOT EXISTS idx_alerts_alert_rule_id ON alerts(alert_rule_id);
CREATE INDEX IF NOT EXISTS idx_alerts_ruche_id ON alerts(ruche_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);

-- Create update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ruchers_updated_at BEFORE UPDATE ON ruchers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ruches_updated_at BEFORE UPDATE ON ruches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_rules_updated_at BEFORE UPDATE ON alert_rules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
