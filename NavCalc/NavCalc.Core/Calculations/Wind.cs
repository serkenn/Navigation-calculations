using System;
using static NavCalc.Core.Calculations.NavigationMath;

namespace NavCalc.Core.Calculations
{
    public static class Wind
    {
        /// <summary>
        /// 真風向・風速 (True Wind)
        /// </summary>
        public static (double TrueDir, double TrueSpeed) TrueWind(
            double relativeDir, double relativeSpeed, double shipCourse, double shipSpeed)
        {
            double apparentDir = shipCourse + relativeDir;
            double appR = Rad(apparentDir);
            double scR = Rad(shipCourse);

            double awx = relativeSpeed * Math.Sin(appR);
            double awy = relativeSpeed * Math.Cos(appR);

            double sx = shipSpeed * Math.Sin(scR);
            double sy = shipSpeed * Math.Cos(scR);

            double twx = awx - sx;
            double twy = awy - sy;

            double trueSpeed = Math.Sqrt(twx * twx + twy * twy);
            double trueDir = Deg(Math.Atan2(twx, twy));
            if (trueDir < 0) trueDir += 360.0;

            return (trueDir, trueSpeed);
        }
    }
}
