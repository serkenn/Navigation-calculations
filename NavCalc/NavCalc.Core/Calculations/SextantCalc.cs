using System;
using static NavCalc.Core.Calculations.NavigationMath;

namespace NavCalc.Core.Calculations
{
    public enum BodyType
    {
        SunLower,
        SunUpper,
        Star,
        Moon,
        Planet
    }

    public static class SextantCalc
    {
        /// <summary>
        /// 測高度改正
        /// </summary>
        public static (double Hs, double Ho, double Dip, double Refraction,
            double Parallax, double SdCorr, double TotalCorr, double Ha,
            double HeightOfEye, BodyType BodyType)
            AltitudeCorrection(double hs, double heightOfEye,
                BodyType bodyType = BodyType.SunLower,
                double temp = 10, double pressure = 1010,
                double hp = 0, double sd = 16.0)
        {
            // 1. Dip
            double dip = 1.76 * Math.Sqrt(heightOfEye);

            // 2. Apparent altitude
            double ha = hs - dip / 60.0;

            // 3. Refraction
            double haR = Rad(ha);
            double refraction = 0;
            if (ha > 0)
            {
                refraction = 1.0 / Math.Tan(haR + Rad(7.31 / (ha + 4.4)));
                double factor = (pressure / 1010.0) * (283.0 / (273.0 + temp));
                refraction *= factor;
            }

            // 4. Parallax
            double parallax = 0;
            if (bodyType == BodyType.SunLower || bodyType == BodyType.SunUpper)
                parallax = 0.15 * Math.Cos(haR);
            else if (bodyType == BodyType.Moon)
                parallax = hp * Math.Cos(haR);

            // 5. Semi-diameter
            double sdCorr = 0;
            if (bodyType == BodyType.SunLower || bodyType == BodyType.Moon)
                sdCorr = sd;
            else if (bodyType == BodyType.SunUpper)
                sdCorr = -sd;

            double totalCorr = -dip - refraction + parallax + sdCorr;
            double ho = hs + totalCorr / 60.0;

            return (hs, ho, dip, refraction, parallax, sdCorr, totalCorr, ha, heightOfEye, bodyType);
        }

        /// <summary>
        /// 物標距離 (Distance by Vertical Angle)
        /// </summary>
        public static (double DistanceM, double DistanceNM)
            DistanceByVerticalAngle(double angle, double height, double heightOfEye)
        {
            double h = height - heightOfEye;
            if (angle <= 0 || h <= 0) return (0, 0);

            double angleR = Rad(angle);
            double distanceM = h / Math.Tan(angleR);
            double distanceNM = distanceM / 1852.0;

            return (distanceM, distanceNM);
        }

        /// <summary>
        /// 地理学的視距離
        /// </summary>
        public static double GeographicalRange(double height, double heightOfEye)
        {
            return 2.08 * (Math.Sqrt(height) + Math.Sqrt(heightOfEye));
        }

        /// <summary>
        /// 水平線距離
        /// </summary>
        public static double DistanceToHorizon(double heightOfEye)
        {
            return 2.08 * Math.Sqrt(heightOfEye);
        }
    }
}
