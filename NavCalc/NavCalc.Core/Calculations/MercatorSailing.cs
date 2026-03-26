using System;
using static NavCalc.Core.Calculations.NavigationMath;

namespace NavCalc.Core.Calculations
{
    public static class MercatorSailing
    {
        private const double WGS84_ECCENTRICITY = 0.08181919;

        /// <summary>
        /// 子午線弧長 (Meridional Parts) - WGS84楕円体近似
        /// </summary>
        public static double MeridionalParts(double lat)
        {
            double latR = Rad(Math.Abs(lat));
            double e = WGS84_ECCENTRICITY;
            double sinL = Math.Sin(latR);
            double eSinL = e * sinL;
            double mp = 7915.7045 * Math.Log10(Math.Tan(Math.PI / 4.0 + latR / 2.0))
                       - 3437.7468 * Math.Log10((1.0 + eSinL) / (1.0 - eSinL));
            return lat >= 0 ? mp : -mp;
        }

        /// <summary>
        /// メルカトル航法: 2地点間の針路と航程
        /// </summary>
        public static (double Course, double Distance, double DLat, double DLon, double DMP)
            CourseDistance(double lat1, double lon1, double lat2, double lon2)
        {
            double dLat = (lat2 - lat1) * 60.0;
            double dLon = (lon2 - lon1) * 60.0;
            while (dLon > 180 * 60) dLon -= 360 * 60;
            while (dLon < -180 * 60) dLon += 360 * 60;

            double dmp = MeridionalParts(lat2) - MeridionalParts(lat1);

            double course;
            double distance;

            if (Math.Abs(dmp) < 0.001)
            {
                course = dLon > 0 ? 90.0 : 270.0;
                distance = Math.Abs(dLon) * Math.Cos(Rad(lat1));
            }
            else
            {
                course = Deg(Math.Atan2(dLon, dmp));
                if (course < 0) course += 360.0;

                if (Math.Abs(Math.Cos(Rad(course))) < 0.0001)
                    distance = Math.Abs(dLon) * Math.Cos(Rad(lat1));
                else
                    distance = Math.Abs(dLat / Math.Cos(Rad(course)));
            }

            return (course, distance, dLat, dLon, dmp);
        }

        /// <summary>
        /// メルカトル航法: 出発点、針路、航程から到着点を計算
        /// </summary>
        public static (double Lat2, double Lon2, double DLat, double DLon, double Dep)
            DeadReckoning(double lat1, double lon1, double course, double distance)
        {
            double dLat = distance * Math.Cos(Rad(course)) / 60.0;
            double lat2 = lat1 + dLat;

            double mp1 = MeridionalParts(lat1);
            double mp2 = MeridionalParts(lat2);
            double dmp = mp2 - mp1;

            double dLon;
            if (Math.Abs(dmp) < 0.001)
                dLon = distance * Math.Sin(Rad(course)) / Math.Cos(Rad(lat1)) / 60.0;
            else
                dLon = dmp * Math.Tan(Rad(course)) / 60.0;

            double lon2 = lon1 + dLon;
            while (lon2 > 180) lon2 -= 360;
            while (lon2 <= -180) lon2 += 360;

            double dep = distance * Math.Sin(Rad(course));

            return (lat2, lon2, dLat, dLon, dep);
        }
    }
}
