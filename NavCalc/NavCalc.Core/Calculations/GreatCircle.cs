using System;
using static NavCalc.Core.Calculations.NavigationMath;

namespace NavCalc.Core.Calculations
{
    public static class GreatCircle
    {
        /// <summary>
        /// 大圏航法: 距離と初針路
        /// </summary>
        public static (double Distance, double Course, double LatVertex)
            GreatCircleSailing(double lat1, double lon1, double lat2, double lon2)
        {
            double l1 = Rad(lat1), l2 = Rad(lat2);
            double dLon = Rad(lon2 - lon1);
            while (dLon > Math.PI) dLon -= 2.0 * Math.PI;
            while (dLon < -Math.PI) dLon += 2.0 * Math.PI;

            double cosD = Math.Sin(l1) * Math.Sin(l2) + Math.Cos(l1) * Math.Cos(l2) * Math.Cos(dLon);
            double d = Math.Acos(Math.Max(-1.0, Math.Min(1.0, cosD)));
            double distNM = Deg(d) * 60.0;

            double sinC = Math.Sin(dLon) * Math.Cos(l2);
            double cosC = Math.Cos(l1) * Math.Sin(l2) - Math.Sin(l1) * Math.Cos(l2) * Math.Cos(dLon);
            double course = Deg(Math.Atan2(sinC, cosC));
            if (course < 0) course += 360.0;

            double courseForVertex = course > 180 ? 360 - course : course;
            double sinRad = Rad(courseForVertex);
            double sinLv = Math.Sin(l1) / (Math.Abs(Math.Sin(sinRad)) < 1e-10 ? 1e-10 : Math.Sin(sinRad));
            double latVertex = Deg(Math.Asin(Math.Max(-1.0, Math.Min(1.0, sinLv))));

            return (distNM, course, latVertex);
        }

        /// <summary>
        /// 集成大圏航法: 制限緯度を超えない大圏＋平行圏航行
        /// </summary>
        public static (double TotalDistance, double InitialCourse, double GcDist1, double GcDist2,
            double ParallelDist, double LonV1, double LonV2, bool IsComposite)
            CompositeSailing(double lat1, double lon1, double lat2, double lon2, double limitLat)
        {
            double l1 = Rad(lat1), l2 = Rad(lat2);
            double lv = Rad(limitLat);

            var gc = GreatCircleSailing(lat1, lon1, lat2, lon2);
            if (Math.Abs(gc.LatVertex) <= Math.Abs(limitLat))
            {
                return (gc.Distance, gc.Course, gc.Distance, 0, 0, 0, 0, false);
            }

            // Phase 1: GC from departure to limiting latitude
            double cosC1 = Math.Tan(l1) / Math.Tan(lv);
            double c1Deg = Deg(Math.Acos(Math.Max(-1.0, Math.Min(1.0, cosC1))));
            double initialCourse = lat1 >= 0
                ? (lon2 > lon1 ? c1Deg : 360 - c1Deg)
                : (lon2 > lon1 ? 180 - c1Deg : 180 + c1Deg);

            double cosD1 = Math.Sin(l1) / Math.Sin(lv);
            double d1 = Math.Acos(Math.Max(-1.0, Math.Min(1.0, cosD1)));
            double gcDist1 = Deg(d1) * 60.0;

            double cosDLon1 = Math.Cos(d1) / (Math.Cos(l1) * Math.Cos(lv)) - Math.Tan(l1) * Math.Tan(lv);
            double dLon1 = Deg(Math.Acos(Math.Max(-1.0, Math.Min(1.0, cosDLon1))));
            double lonV1 = lon1 + (lon2 > lon1 ? dLon1 : -dLon1);

            // Phase 3: GC from limiting latitude to destination
            double cosD2 = Math.Sin(l2) / Math.Sin(lv);
            double d2 = Math.Acos(Math.Max(-1.0, Math.Min(1.0, cosD2)));
            double gcDist2 = Deg(d2) * 60.0;

            double cosDLon2 = Math.Cos(d2) / (Math.Cos(l2) * Math.Cos(lv)) - Math.Tan(l2) * Math.Tan(lv);
            double dLon2 = Deg(Math.Acos(Math.Max(-1.0, Math.Min(1.0, cosDLon2))));
            double lonV2 = lon2 + (lon2 > lon1 ? -dLon2 : dLon2);

            // Phase 2: Parallel sailing
            double dLonParallel = Math.Abs(lonV2 - lonV1);
            double parallelDist = dLonParallel * 60.0 * Math.Cos(lv);

            double totalDistance = gcDist1 + parallelDist + gcDist2;

            return (totalDistance, initialCourse, gcDist1, gcDist2, parallelDist, lonV1, lonV2, true);
        }
    }
}
