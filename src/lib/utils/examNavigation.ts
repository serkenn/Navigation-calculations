/**
 * Maritime Navigation Exam Calculations
 * Problems: 45, 46, 69, 70, 75, 76, 80, 91, 92, 93, 94, 95, 99
 * Category: 航海 (Navigation)
 */

const PI = Math.PI;
const RAD = (deg: number) => deg * (PI / 180);
const DEG = (rad: number) => rad * (180 / PI);

/**
 * Problem 45, 46: Parallel Sailing - Distance along parallel
 * On a parallel of latitude, distance = Δλ × cos(latitude)
 */
export function calculateParallelSailing(
  latitudeDeg: number,
  longitudeDelta: number, // in minutes
): { distanceNm: number; dmsFormat: string } {
  const distanceNm = (longitudeDelta / 60) * 60 * Math.cos(RAD(latitudeDeg));
  const dmsFormat = `${Math.abs(longitudeDelta).toFixed(1)}' × cos(${latitudeDeg}°) = ${distanceNm.toFixed(1)} nm`;
  return { distanceNm, dmsFormat };
}

/**
 * Problem 45, 46: Meridional Sailing - Distance along meridian
 * Distance along meridian = Δφ × 60 (in nautical miles)
 */
export function calculateMeridionalSailing(
  latitudeStartDeg: number,
  latitudeEndDeg: number,
): { distanceNm: number; latitudeDiff: number } {
  const latitudeDiff = latitudeEndDeg - latitudeStartDeg;
  const distanceNm = Math.abs(latitudeDiff) * 60;
  return { distanceNm, latitudeDiff };
}

/**
 * Problem 69, 70: Great Circle - Initial course and distance
 * Using spherical trigonometry for shortest route between two positions
 */
export function calculateGreatCircle(
  lat1Deg: number,
  lon1Deg: number,
  lat2Deg: number,
  lon2Deg: number,
): {
  distanceNm: number;
  initialCourse: number;
  finalCourse: number;
  midLatitude: number;
  midLongitude: number;
} {
  const lat1 = RAD(lat1Deg);
  const lon1 = RAD(lon1Deg);
  const lat2 = RAD(lat2Deg);
  const lon2 = RAD(lon2Deg);

  // Angular distance using haversine
  const dLon = lon2 - lon1;
  const a =
    Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const distance = Math.acos(Math.max(-1, Math.min(1, a))); // clamp to [-1, 1]
  const distanceNm = DEG(distance) * 60;

  // Initial course
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const initialCourse = (DEG(Math.atan2(y, x)) + 360) % 360;

  // Final course (course at destination)
  const y2 = Math.sin(-dLon) * Math.cos(lat1);
  const x2 =
    Math.cos(lat2) * Math.sin(lat1) -
    Math.sin(lat2) * Math.cos(lat1) * Math.cos(-dLon);
  const finalCourse = (DEG(Math.atan2(y2, x2)) + 360) % 360;

  // Midpoint (approximate)
  const midLatRad = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt(
      (Math.cos(lat1) + Math.cos(lat2)) ** 2 +
        (Math.sin(dLon / 2) * Math.cos((lat1 + lat2) / 2)) ** 2,
    ),
  );
  const midLonRad =
    lon1 +
    Math.atan2(
      Math.sin(dLon) * Math.cos(lat1) * Math.cos(lat2),
      1 + Math.cos(lat1) * Math.cos(lat2) * Math.cos(dLon),
    );

  return {
    distanceNm,
    initialCourse,
    finalCourse,
    midLatitude: DEG(midLatRad),
    midLongitude: DEG(midLonRad),
  };
}

/**
 * Problem 75, 76: Departure and Latitude from Rhumb Line
 * Departure (dep) = distance × sin(course)
 * Latitude change (dLat) = distance × cos(course)
 */
export function calculateDepartureAndLatitude(
  distance: number,
  courseTrue: number,
): {
  departure: number;
  latitudeChange: number;
  latitudeChangeMin: number;
} {
  const courseRad = RAD(courseTrue);
  const departure = distance * Math.sin(courseRad);
  const latitudeChange = distance * Math.cos(courseRad);
  const latitudeChangeMin = latitudeChange * 60; // convert to minutes

  return {
    departure,
    latitudeChange,
    latitudeChangeMin,
  };
}

/**
 * Problem 75, 76: Difference of Longitude from Departure
 * ΔLongitude = Departure / (cos of Mean Latitude)
 */
export function calculateLongitudeDifference(
  departure: number,
  meanLatitude: number,
): {
  longitudeDifference: number;
  longitudeDifferenceMin: number;
} {
  const cosLat = Math.cos(RAD(meanLatitude));
  if (Math.abs(cosLat) < 1e-6) {
    return {
      longitudeDifference: 0,
      longitudeDifferenceMin: 0,
    };
  }

  const longitudeDifference = departure / cosLat; // in nautical miles
  const longitudeDifferenceMin = (longitudeDifference / 60) * 60; // convert to minutes of arc

  return {
    longitudeDifference,
    longitudeDifferenceMin,
  };
}

/**
 * Problem 80: True Wind Calculation
 * Given ship's heading, speed, and apparent wind
 */
export function calculateTrueWind(
  shipHeadingTrue: number,
  shipSpeedKts: number,
  apparentWindDirection: number,
  apparentWindSpeed: number,
): {
  trueWindDirection: number;
  trueWindSpeed: number;
  relativeDirection: number;
} {
  // Convert to radians
  const shipHeadingRad = RAD(shipHeadingTrue);
  const appWindDirRad = RAD(apparentWindDirection);

  // Ship's velocity vector
  const shipVx = shipSpeedKts * Math.sin(shipHeadingRad);
  const shipVy = shipSpeedKts * Math.cos(shipHeadingRad);

  // Apparent wind vector (direction from which wind blows)
  const appWindVx = apparentWindSpeed * Math.sin(appWindDirRad);
  const appWindVy = apparentWindSpeed * Math.cos(appWindDirRad);

  // True wind = apparent wind + ship velocity
  const trueWindVx = appWindVx + shipVx;
  const trueWindVy = appWindVy + shipVy;

  // Calculate true wind direction and speed
  const trueWindSpeed = Math.sqrt(trueWindVx ** 2 + trueWindVy ** 2);
  let trueWindDirection = DEG(Math.atan2(trueWindVx, trueWindVy));
  trueWindDirection = (trueWindDirection + 360) % 360;

  const relativeDirection =
    (apparentWindDirection - shipHeadingTrue + 360) % 360;

  return {
    trueWindDirection,
    trueWindSpeed,
    relativeDirection,
  };
}

/**
 * Problem 91-99: Apparent Wind from True Wind
 * Given true wind and ship's heading/speed, calculate apparent wind
 */
export function calculateApparentWind(
  trueWindDirection: number,
  trueWindSpeed: number,
  shipHeadingTrue: number,
  shipSpeedKts: number,
): {
  apparentWindDirection: number;
  apparentWindSpeed: number;
} {
  // Convert to radians
  const trueWindDirRad = RAD(trueWindDirection);
  const shipHeadingRad = RAD(shipHeadingTrue);

  // True wind vector
  const trueWindVx = trueWindSpeed * Math.sin(trueWindDirRad);
  const trueWindVy = trueWindSpeed * Math.cos(trueWindDirRad);

  // Ship's velocity vector
  const shipVx = shipSpeedKts * Math.sin(shipHeadingRad);
  const shipVy = shipSpeedKts * Math.cos(shipHeadingRad);

  // Apparent wind = true wind - ship velocity
  const appWindVx = trueWindVx - shipVx;
  const appWindVy = trueWindVy - shipVy;

  // Calculate apparent wind direction and speed
  const apparentWindSpeed = Math.sqrt(appWindVx ** 2 + appWindVy ** 2);
  let apparentWindDirection = DEG(Math.atan2(appWindVx, appWindVy));
  apparentWindDirection = (apparentWindDirection + 360) % 360;

  return {
    apparentWindDirection,
    apparentWindSpeed,
  };
}

/**
 * Problem 91-99: Course to Steer with Current
 * Ground track required vs current set/drift
 */
export function calculateCourseToSteer(
  desiredGroundTrack: number,
  shipSpeedKts: number,
  currentSet: number, // direction TO which current flows
  currentDrift: number,
): {
  courseToSteer: number;
  groundSpeed: number;
  currentEffect: number;
} {
  // Convert to radians
  const groundTrackRad = RAD(desiredGroundTrack);
  const currentSetRad = RAD(currentSet);

  // For simplicity, assume we want a specific ground speed
  // and calculate course needed to maintain ground track
  const shipVx = shipSpeedKts * Math.sin(groundTrackRad);
  const shipVy = shipSpeedKts * Math.cos(groundTrackRad);

  // Current vector
  const currentVx = currentDrift * Math.sin(currentSetRad);
  const currentVy = currentDrift * Math.cos(currentSetRad);

  // Find course to steer (reverse calculation)
  const courseVx = shipVx - currentVx;
  const courseVy = shipVy - currentVy;

  let courseToSteer = DEG(Math.atan2(courseVx, courseVy));
  courseToSteer = (courseToSteer + 360) % 360;

  const groundSpeed = Math.sqrt(shipVx ** 2 + shipVy ** 2);
  const currentEffect = Math.sqrt(currentVx ** 2 + currentVy ** 2);

  return {
    courseToSteer,
    groundSpeed,
    currentEffect,
  };
}

/**
 * Problem 91-99: Estimated Position After Time
 * Dead reckoning calculation
 */
export function calculateDeadReckoning(
  startLatitude: number,
  startLongitude: number,
  courseTrue: number,
  speedKts: number,
  timeHours: number,
): {
  endLatitude: number;
  endLongitude: number;
  distance: number;
  latitudeChange: number;
  longitudeChange: number;
} {
  const distance = speedKts * timeHours;
  const courseRad = RAD(courseTrue);

  // Latitude change (in degree units)
  const latitudeChangeRad = (distance / 60) * Math.cos(courseRad);
  const latitudeChange = DEG(RAD(latitudeChangeRad) * 60) / 60;
  const endLatitude = startLatitude + latitudeChange;

  // Longitude change (accounting for latitude)
  const meanLatitude = (startLatitude + endLatitude) / 2;
  const departure = distance * Math.sin(courseRad);
  const cosLat = Math.cos(RAD(meanLatitude));
  const longitudeChangeDeg =
    Math.abs(cosLat) < 1e-6 ? 0 : (departure / 60) * (1 / cosLat);
  const endLongitude = startLongitude + longitudeChangeDeg;

  return {
    endLatitude,
    endLongitude,
    distance,
    latitudeChange,
    longitudeChange: longitudeChangeDeg,
  };
}

/**
 * Helper: Format degrees to DMS
 */
export function formatDMS(value: number, type: "lat" | "lon" = "lat"): string {
  const absVal = Math.abs(value);
  const deg = Math.floor(absVal);
  const min = (absVal - deg) * 60;
  const minStr = min.toFixed(1).padStart(4, "0");

  const suffix =
    type === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";

  return `${deg}° ${minStr}'${suffix}`;
}
