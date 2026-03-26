using System;
using static NavCalc.Core.Calculations.NavigationMath;

namespace NavCalc.Core.Calculations
{
    public static class Astronomy
    {
        /// <summary>
        /// 薄明時計算
        /// </summary>
        public static (double Rise, double Set, bool Possible, double HourAngle) TwilightTime(
            double lat, double dec, double lon, double eqTime, double alt)
        {
            double latR = Rad(lat), decR = Rad(dec), altR = Rad(alt);
            double cosH = (Math.Sin(altR) - Math.Sin(latR) * Math.Sin(decR))
                        / (Math.Cos(latR) * Math.Cos(decR));

            if (Math.Abs(cosH) > 1)
                return (double.NaN, double.NaN, false, 0);

            double h = Deg(Math.Acos(cosH));
            double hHours = h / 15.0;
            double transit = 12.0 - eqTime / 60.0;
            double rise = transit - hHours - lon / 15.0;
            double set = transit + hHours - lon / 15.0;

            return (rise, set, true, h);
        }

        /// <summary>
        /// 全薄明時刻をまとめて計算
        /// </summary>
        public static (
            (double Rise, double Set, bool Possible, double HourAngle) Sunrise,
            (double Rise, double Set, bool Possible, double HourAngle) Civil,
            (double Rise, double Set, bool Possible, double HourAngle) Nautical,
            (double Rise, double Set, bool Possible, double HourAngle) Astronomical
        ) AllTwilights(double lat, double dec, double lon, double eqTime)
        {
            var sunrise = TwilightTime(lat, dec, lon, eqTime, -0.833);
            var civil = TwilightTime(lat, dec, lon, eqTime, -6.0);
            var nautical = TwilightTime(lat, dec, lon, eqTime, -12.0);
            var astronomical = TwilightTime(lat, dec, lon, eqTime, -18.0);

            return (sunrise, civil, nautical, astronomical);
        }

        /// <summary>
        /// 索星: 恒星の高度と方位を計算
        /// </summary>
        public static (double Alt, double Az) StarAltAz(double lat, double dec, double lha)
        {
            double latR = Rad(lat), decR = Rad(dec), lhaR = Rad(lha);

            double sinH = Math.Sin(latR) * Math.Sin(decR) + Math.Cos(latR) * Math.Cos(decR) * Math.Cos(lhaR);
            double alt = Deg(Math.Asin(Math.Max(-1.0, Math.Min(1.0, sinH))));

            double cosAz = (Math.Sin(decR) - Math.Sin(latR) * sinH)
                         / (Math.Cos(latR) * Math.Cos(Math.Asin(sinH)));
            double az = Deg(Math.Acos(Math.Max(-1.0, Math.Min(1.0, cosAz))));
            if (Math.Sin(lhaR) > 0) az = 360.0 - az;

            return (alt, az);
        }
    }
}
