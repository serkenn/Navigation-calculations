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
 * Light Range (Geographic Visibility Distance)
 * D = 2.083 × (√H + √h)
 * H: light height [m], h: eye height [m]
 */
export function calculateLightRange(
  lightHeightM: number,
  eyeHeightM: number,
): {
  lightGeoRange: number;
  eyeGeoRange: number;
  totalRange: number;
} {
  const lightGeoRange = 2.083 * Math.sqrt(lightHeightM);
  const eyeGeoRange = 2.083 * Math.sqrt(eyeHeightM);
  const totalRange = lightGeoRange + eyeGeoRange;
  return { lightGeoRange, eyeGeoRange, totalRange };
}

/**
 * Tidal Current from Tidal Stream Table
 * Interpolates current speed and finds slack/max times
 */
export function calculateTidalCurrent(
  highTideTimeH: number,
  highTideTimeM: number,
  targetTimeH: number,
  targetTimeM: number,
  springRate: number,
  neapRate: number,
  springNeapFactor: number,
): {
  hoursFromHighTide: number;
  interpolatedRate: number;
  currentSpeed: number;
} {
  const highTideMin = highTideTimeH * 60 + highTideTimeM;
  const targetMin = targetTimeH * 60 + targetTimeM;
  let diffMin = targetMin - highTideMin;
  if (diffMin < -360) diffMin += 720;
  if (diffMin > 360) diffMin -= 720;
  const hoursFromHighTide = diffMin / 60;

  const interpolatedRate =
    neapRate + (springRate - neapRate) * springNeapFactor;
  const currentSpeed = interpolatedRate;

  return { hoursFromHighTide, interpolatedRate, currentSpeed };
}

/**
 * Cross Bearing Position Fix
 * Two bearings from known positions to determine ship position
 */
export function calculateCrossBearing(
  obj1Lat: number,
  obj1Lon: number,
  bearing1: number,
  obj2Lat: number,
  obj2Lon: number,
  bearing2: number,
): {
  shipLat: number;
  shipLon: number;
} {
  const lat1 = RAD(obj1Lat);
  const lon1 = RAD(obj1Lon);
  const lat2 = RAD(obj2Lat);
  const lon2 = RAD(obj2Lon);
  const b1 = RAD(bearing1);
  const b2 = RAD(bearing2);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const dist12 = 2 * Math.asin(Math.sqrt(
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  ));

  if (Math.abs(dist12) < 1e-10) {
    return { shipLat: obj1Lat, shipLon: obj1Lon };
  }

  const bearingA = Math.acos(
    (Math.sin(lat2) - Math.sin(lat1) * Math.cos(dist12)) /
    (Math.sin(dist12) * Math.cos(lat1))
  );
  const bearingB = Math.acos(
    (Math.sin(lat1) - Math.sin(lat2) * Math.cos(dist12)) /
    (Math.sin(dist12) * Math.cos(lat2))
  );

  let bearing12: number;
  let bearing21: number;
  if (Math.sin(lon2 - lon1) > 0) {
    bearing12 = bearingA;
    bearing21 = 2 * PI - bearingB;
  } else {
    bearing12 = 2 * PI - bearingA;
    bearing21 = bearingB;
  }

  const alpha1 = ((b1 - bearing12 + PI) % (2 * PI)) - PI;
  const alpha2 = ((bearing21 - b2 + PI) % (2 * PI)) - PI;

  if (Math.abs(Math.sin(alpha1)) < 1e-10 && Math.abs(Math.sin(alpha2)) < 1e-10) {
    return { shipLat: obj1Lat, shipLon: obj1Lon };
  }

  const alpha3 = Math.acos(
    -Math.cos(alpha1) * Math.cos(alpha2) +
    Math.sin(alpha1) * Math.sin(alpha2) * Math.cos(dist12)
  );

  const dist13 = Math.atan2(
    Math.sin(dist12) * Math.sin(alpha1) * Math.sin(alpha2),
    Math.cos(alpha2) + Math.cos(alpha1) * Math.cos(alpha3)
  );

  const shipLat = Math.asin(
    Math.sin(lat1) * Math.cos(dist13) +
    Math.cos(lat1) * Math.sin(dist13) * Math.cos(b1)
  );

  const shipLon = lon1 + Math.atan2(
    Math.sin(b1) * Math.sin(dist13) * Math.cos(lat1),
    Math.cos(dist13) - Math.sin(lat1) * Math.sin(shipLat)
  );

  return { shipLat: DEG(shipLat), shipLon: DEG(shipLon) };
}

/**
 * Running Fix
 * Transfer position line to determine fix
 */
export function calculateRunningFix(
  bearing1: number,
  bearing2: number,
  courseTrue: number,
  speedKts: number,
  timeBetweenMin: number,
  objectLat: number,
  objectLon: number,
): {
  distanceRun: number;
  fixLat: number;
  fixLon: number;
  distanceFromObject: number;
} {
  const distanceRun = speedKts * (timeBetweenMin / 60);

  const b1Rad = RAD(bearing1);
  const b2Rad = RAD(bearing2);
  const angleAtObject = Math.abs(bearing2 - bearing1);
  const angleAtObjectRad = RAD(angleAtObject);

  const courseRad = RAD(courseTrue);
  const angleAtFix = Math.abs(bearing2 - courseTrue);
  const angleAtFixRad = RAD(angleAtFix > 180 ? 360 - angleAtFix : angleAtFix);

  const sinAngleObj = Math.sin(angleAtObjectRad);
  const distanceFromObject = sinAngleObj === 0 ? 0 :
    distanceRun * Math.sin(RAD(Math.abs(bearing1 - courseTrue) > 180 ? 360 - Math.abs(bearing1 - courseTrue) : Math.abs(bearing1 - courseTrue))) / sinAngleObj;

  const fixLat = objectLat + (distanceFromObject / 60) * Math.cos(b2Rad);
  const meanLat = (objectLat + fixLat) / 2;
  const cosLat = Math.cos(RAD(meanLat));
  const fixLon = cosLat === 0 ? objectLon :
    objectLon + (distanceFromObject / 60) * Math.sin(b2Rad) / cosLat;

  return { distanceRun, fixLat, fixLon, distanceFromObject };
}

/**
 * Ship Clock Correction
 * Time zone and clock adjustment based on longitude
 */
export function calculateClockCorrection(
  departureLonDeg: number,
  departureLonMin: number,
  departureLonEW: 'E' | 'W',
  arrivalLonDeg: number,
  arrivalLonMin: number,
  arrivalLonEW: 'E' | 'W',
  standardMeridian: number,
): {
  departureLon: number;
  arrivalLon: number;
  longitudeDiff: number;
  timeDiffMinutes: number;
  timeDiffHours: number;
  timeDiffRemainMin: number;
  direction: string;
  departureZone: number;
  arrivalZone: number;
  zoneDiff: number;
} {
  const depLon = (departureLonDeg + departureLonMin / 60) * (departureLonEW === 'W' ? -1 : 1);
  const arrLon = (arrivalLonDeg + arrivalLonMin / 60) * (arrivalLonEW === 'W' ? -1 : 1);

  const longitudeDiff = arrLon - depLon;
  const timeDiffMinutes = (longitudeDiff / 360) * 24 * 60;
  const timeDiffHours = Math.floor(Math.abs(timeDiffMinutes) / 60);
  const timeDiffRemainMin = Math.abs(timeDiffMinutes) % 60;

  const direction = longitudeDiff > 0 ? '進める' : '遅らせる';

  const departureZone = Math.round(depLon / 15);
  const arrivalZone = Math.round(arrLon / 15);
  const zoneDiff = arrivalZone - departureZone;

  return {
    departureLon: depLon,
    arrivalLon: arrLon,
    longitudeDiff,
    timeDiffMinutes,
    timeDiffHours,
    timeDiffRemainMin: Math.round(timeDiffRemainMin * 100) / 100,
    direction,
    departureZone,
    arrivalZone,
    zoneDiff,
  };
}

/**
 * Sunrise / Sunset time calculation (simplified)
 * Using approximate formula for civil sunrise/sunset
 */
export function calculateSunriseSunset(
  latitudeDeg: number,
  longitudeDeg: number,
  dayOfYear: number,
  standardMeridian: number,
): {
  sunriseLocal: string;
  sunsetLocal: string;
  daylightHours: number;
  solarNoonLocal: string;
  declination: number;
  equationOfTime: number;
} {
  const B = (360 / 365) * (dayOfYear - 81);
  const Brad = RAD(B);

  const declination = 23.45 * Math.sin(Brad);
  const decRad = RAD(declination);
  const latRad = RAD(latitudeDeg);

  const cosHA = -Math.tan(latRad) * Math.tan(decRad);
  const clampedCosHA = Math.max(-1, Math.min(1, cosHA));
  const HA = DEG(Math.acos(clampedCosHA));

  const equationOfTime = 9.87 * Math.sin(2 * Brad) - 7.53 * Math.cos(Brad) - 1.5 * Math.sin(Brad);

  const solarNoonMin = 720 - 4 * (longitudeDeg - standardMeridian) - equationOfTime;
  const sunriseMin = solarNoonMin - HA * 4;
  const sunsetMin = solarNoonMin + HA * 4;

  const daylightHours = (HA * 2) / 15;

  const formatTime = (min: number) => {
    let m = ((min % 1440) + 1440) % 1440;
    const h = Math.floor(m / 60);
    const mm = Math.round(m % 60);
    return `${h.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  };

  return {
    sunriseLocal: formatTime(sunriseMin),
    sunsetLocal: formatTime(sunsetMin),
    daylightHours: Math.round(daylightHours * 100) / 100,
    solarNoonLocal: formatTime(solarNoonMin),
    declination: Math.round(declination * 100) / 100,
    equationOfTime: Math.round(equationOfTime * 100) / 100,
  };
}

/**
 * Amplitude and Gyro Error
 * Calculate true bearing of celestial body at rising/setting
 * Z = cos⁻¹(sin d / cos φ) — amplitude formula
 */
export function calculateAmplitudeGyroError(
  latitudeDeg: number,
  declinationDeg: number,
  compassBearing: number,
  isRising: boolean,
): {
  amplitude: number;
  trueBearing: number;
  gyroError: number;
  gyroErrorLabel: string;
  amplitudeLabel: string;
} {
  const latRad = RAD(latitudeDeg);
  const decRad = RAD(declinationDeg);

  const cosLat = Math.cos(latRad);
  if (Math.abs(cosLat) < 1e-10) {
    return { amplitude: 0, trueBearing: 0, gyroError: 0, gyroErrorLabel: '', amplitudeLabel: '' };
  }

  const sinAmp = Math.sin(decRad) / cosLat;
  const clampedSinAmp = Math.max(-1, Math.min(1, sinAmp));
  const amplitude = DEG(Math.acos(Math.abs(clampedSinAmp)));
  const amplitudeFromEquator = DEG(Math.asin(Math.abs(clampedSinAmp)));

  let trueBearing: number;
  const ns = declinationDeg >= 0 ? 'N' : 'S';

  if (isRising) {
    trueBearing = declinationDeg >= 0 ? 90 - amplitudeFromEquator : 90 + amplitudeFromEquator;
    if (latitudeDeg < 0) {
      trueBearing = declinationDeg >= 0 ? 90 - amplitudeFromEquator : 90 + amplitudeFromEquator;
    }
  } else {
    trueBearing = declinationDeg >= 0 ? 270 + amplitudeFromEquator : 270 - amplitudeFromEquator;
    if (latitudeDeg < 0) {
      trueBearing = declinationDeg >= 0 ? 270 + amplitudeFromEquator : 270 - amplitudeFromEquator;
    }
  }

  trueBearing = (trueBearing + 360) % 360;

  let gyroError = trueBearing - compassBearing;
  if (gyroError > 180) gyroError -= 360;
  if (gyroError < -180) gyroError += 360;

  const ew = isRising ? 'E' : 'W';
  const amplitudeLabel = `${ew} ${amplitudeFromEquator.toFixed(1)}° ${ns}`;
  const gyroErrorLabel = gyroError >= 0
    ? `${Math.abs(gyroError).toFixed(1)}° E(ly)`
    : `${Math.abs(gyroError).toFixed(1)}° W(ly)`;

  return { amplitude: amplitudeFromEquator, trueBearing, gyroError, gyroErrorLabel, amplitudeLabel };
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
