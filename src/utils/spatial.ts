/**
 * Spatial utility functions for PostGIS operations
 */

/**
 * Convert coordinates to PostGIS POINT format
 * @param longitude - Longitude coordinate
 * @param latitude - Latitude coordinate
 * @returns PostGIS POINT geometry
 */
export function createPoint(longitude: number, latitude: number): any {
  return {
    type: 'Point',
    coordinates: [longitude, latitude],
    crs: { type: 'name', properties: { name: 'EPSG:4326' } },
  };
}

/**
 * Convert polygon coordinates to PostGIS POLYGON format
 * @param coordinates - Array of coordinate pairs [lng, lat]
 * @returns PostGIS POLYGON geometry
 */
export function createPolygon(coordinates: number[][]): any {
  // Ensure the polygon is closed (first point equals last point)
  if (
    coordinates.length > 0 &&
    (coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
      coordinates[0][1] !== coordinates[coordinates.length - 1][1])
  ) {
    coordinates.push(coordinates[0]);
  }

  return {
    type: 'Polygon',
    coordinates: [coordinates],
    crs: { type: 'name', properties: { name: 'EPSG:4326' } },
  };
}

/**
 * Convert Sequelize geometry to GeoJSON
 * @param geometry - Sequelize geometry object
 * @returns GeoJSON geometry
 */
export function toGeoJSON(geometry: any): any {
  if (!geometry) return null;

  if (typeof geometry === 'string') {
    try {
      return JSON.parse(geometry);
    } catch {
      return geometry;
    }
  }

  return geometry;
}

/**
 * Create a GeoJSON Feature from properties and geometry
 * @param properties - Feature properties
 * @param geometry - GeoJSON geometry
 * @returns GeoJSON Feature
 */
export function createFeature(properties: any, geometry: any): any {
  return {
    type: 'Feature',
    geometry: toGeoJSON(geometry),
    properties,
  };
}

/**
 * Create a GeoJSON FeatureCollection from an array of features
 * @param features - Array of GeoJSON features
 * @returns GeoJSON FeatureCollection
 */
export function createFeatureCollection(features: any[]): any {
  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Calculate distance between two points in meters using PostGIS
 * This is a helper to construct the SQL query - actual calculation happens in DB
 * @param point1 - First point [lng, lat]
 * @param point2 - Second point [lng, lat]
 * @returns SQL fragment for ST_Distance calculation
 */
export function distanceSQL(point1: string, point2: string): string {
  return `ST_Distance(${point1}::geography, ${point2}::geography)`;
}

/**
 * Create a buffer around a geometry in meters
 * @param geometry - Geometry column name
 * @param radius - Buffer radius in meters
 * @returns SQL fragment for ST_Buffer calculation
 */
export function bufferSQL(geometry: string, radius: number): string {
  return `ST_Buffer(${geometry}::geography, ${radius})::geometry`;
}

/**
 * Check if a point is within a polygon
 * @param point - Point column name
 * @param polygon - Polygon column name
 * @returns SQL fragment for ST_Within check
 */
export function withinSQL(point: string, polygon: string): string {
  return `ST_Within(${point}, ${polygon})`;
}
