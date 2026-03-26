using System;

namespace NavCalc.Core.Calculations
{
    public static class TimeConversion
    {
        /// <summary>
        /// 時間 → 弧度
        /// </summary>
        public static (int Deg, int Min, double Sec, double TotalDegrees)
            TimeToArc(int h, int m, int s)
        {
            int totalSeconds = h * 3600 + m * 60 + s;
            int arcSeconds = totalSeconds * 15;
            int deg = arcSeconds / 3600;
            int arcMin = (arcSeconds % 3600) / 60;
            double arcSec = Math.Round((arcSeconds % 60) * 10.0) / 10.0;
            return (deg, arcMin, arcSec, arcSeconds / 3600.0);
        }

        /// <summary>
        /// 弧度 → 時間
        /// </summary>
        public static (int H, int M, double S, double TotalHours)
            ArcToTime(int deg, int min, int sec)
        {
            int totalArcSeconds = deg * 3600 + min * 60 + sec;
            double timeSeconds = totalArcSeconds / 15.0;
            int h = (int)(timeSeconds / 3600);
            int m = (int)((timeSeconds % 3600) / 60);
            double s = Math.Round((timeSeconds % 60) * 10.0) / 10.0;
            return (h, m, s, timeSeconds / 3600.0);
        }

        /// <summary>
        /// 10進数時間 → 時分秒
        /// </summary>
        public static (int H, int M, double S, int Sign) DecimalToHMS(double dec)
        {
            int sign = dec < 0 ? -1 : 1;
            double abs = Math.Abs(dec);
            int h = (int)Math.Floor(abs);
            int m = (int)Math.Floor((abs - h) * 60.0);
            double s = Math.Round(((abs - h) * 60.0 - m) * 60.0 * 10.0) / 10.0;
            return (h, m, s, sign);
        }

        /// <summary>
        /// 時分秒 → 10進数時間
        /// </summary>
        public static double HMSToDecimal(int h, int m, double s)
        {
            return h + m / 60.0 + s / 3600.0;
        }

        /// <summary>
        /// 時分秒形式の四則計算
        /// </summary>
        public static (int H, int M, double S, int Sign, double Decimal)
            HMSArithmetic(int h1, int m1, double s1, char op, int h2, int m2, double s2, double? multiplier = null)
        {
            double dec1 = HMSToDecimal(h1, m1, s1);
            double dec2 = HMSToDecimal(h2, m2, s2);

            double resultDec;
            switch (op)
            {
                case '+': resultDec = dec1 + dec2; break;
                case '-': resultDec = dec1 - dec2; break;
                case '*': resultDec = dec1 * (multiplier ?? dec2); break;
                case '/': resultDec = dec2 != 0 ? dec1 / (multiplier ?? dec2) : 0; break;
                default: resultDec = 0; break;
            }

            var hms = DecimalToHMS(resultDec);
            return (hms.H, hms.M, hms.S, hms.Sign, resultDec);
        }
    }
}
