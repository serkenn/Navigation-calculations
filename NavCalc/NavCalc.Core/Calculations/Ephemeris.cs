using System;

namespace NavCalc.Core.Calculations
{
    public static class Ephemeris
    {
        /// <summary>
        /// 太陽のGHAとDecを計算 (簡易Meeus法)
        /// </summary>
        public static (double Gha, double Dec, double Ra, double EqTime, double Gmst)
            SolarPosition(int year, int month, int day, double utcHours)
        {
            // Julian Day Number
            int a = (14 - month) / 12;
            int y = year + 4800 - a;
            int m = month + 12 * a - 3;
            int jdn = day + (153 * m + 2) / 5 + 365 * y + y / 4 - y / 100 + y / 400 - 32045;
            double jd = jdn + (utcHours - 12.0) / 24.0;

            // Julian century from J2000.0
            double T = (jd - 2451545.0) / 36525.0;

            // Sun's mean longitude
            double L0 = (280.46646 + 36000.76983 * T + 0.0003032 * T * T) % 360.0;
            // Sun's mean anomaly
            double M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) % 360.0;
            double Mr = M * Math.PI / 180.0;

            // Equation of center
            double C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.Sin(Mr)
                      + (0.019993 - 0.000101 * T) * Math.Sin(2.0 * Mr)
                      + 0.000289 * Math.Sin(3.0 * Mr);

            // Sun's true longitude
            double sunLon = L0 + C;
            double sunLonR = sunLon * Math.PI / 180.0;

            // Obliquity
            double epsilon = 23.439291 - 0.0130042 * T;
            double epsilonR = epsilon * Math.PI / 180.0;

            // Right ascension
            double ra = Math.Atan2(Math.Cos(epsilonR) * Math.Sin(sunLonR), Math.Cos(sunLonR)) * 180.0 / Math.PI;

            // Declination
            double dec = Math.Asin(Math.Sin(epsilonR) * Math.Sin(sunLonR)) * 180.0 / Math.PI;

            // GMST
            double gmst = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T) % 360.0;

            // GHA
            double gha = gmst - ra;
            while (gha < 0) gha += 360.0;
            while (gha >= 360) gha -= 360.0;

            // Equation of Time
            double eqTime = 4.0 * (L0 - ra);

            return (gha, dec, ra, eqTime, gmst);
        }
    }
}
