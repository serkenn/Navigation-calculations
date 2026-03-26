using System;

namespace NavCalc.Core.Calculations
{
    public static class Tide
    {
        /// <summary>
        /// 潮高計算 (cos補間法)
        /// </summary>
        public static (double Height, double Range, double Duration, double Elapsed, double Ratio)
            TideHeight(double hwHeight, double lwHeight, double hwTime, double lwTime, double targetTime)
        {
            double range = hwHeight - lwHeight;
            double duration;
            double elapsed;

            if (lwTime < hwTime)
            {
                duration = hwTime - lwTime;
                elapsed = targetTime - lwTime;
            }
            else
            {
                duration = lwTime - hwTime;
                elapsed = targetTime - hwTime;
            }

            if (duration <= 0) return (0, range, duration, elapsed, 0);

            double ratio = elapsed / duration;
            double height = lwHeight + (range / 2.0) * (1.0 - Math.Cos(Math.PI * ratio));

            return (height, range, duration, elapsed, ratio);
        }

        /// <summary>
        /// 指定潮高に達する時刻を逆算
        /// </summary>
        public static (double Time, double Ratio) TideTimeForHeight(
            double hwHeight, double lwHeight, double hwTime, double lwTime, double targetHeight)
        {
            double range = hwHeight - lwHeight;
            if (range == 0) return (lwTime, 0);

            double cosVal = 1.0 - 2.0 * (targetHeight - lwHeight) / range;
            cosVal = Math.Max(-1.0, Math.Min(1.0, cosVal));
            double ratio = Math.Acos(cosVal) / Math.PI;

            double duration = lwTime < hwTime ? hwTime - lwTime : lwTime - hwTime;
            double time = lwTime + ratio * duration;

            return (time, ratio);
        }

        /// <summary>
        /// 潮流計算 (線形補間)
        /// </summary>
        public static (double Rate, double Dir) TidalStream(
            double rate1, double dir1, double rate2, double dir2, double fraction)
        {
            double rate = rate1 + (rate2 - rate1) * fraction;

            double dDir = dir2 - dir1;
            while (dDir > 180) dDir -= 360;
            while (dDir < -180) dDir += 360;
            double dir = dir1 + dDir * fraction;
            if (dir < 0) dir += 360;
            if (dir >= 360) dir -= 360;

            return (rate, dir);
        }
    }
}
