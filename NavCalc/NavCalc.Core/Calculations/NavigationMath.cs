using System;

namespace NavCalc.Core.Calculations
{
    public static class NavigationMath
    {
        public static double Rad(double deg) => deg * (Math.PI / 180.0);
        public static double Deg(double rad) => rad * (180.0 / Math.PI);

        /// <summary>
        /// 数値(10進数) → 度分(文字列)
        /// </summary>
        public static string FormatDMS(double val, string type = "angle")
        {
            double absVal = Math.Abs(val);
            int d = (int)Math.Floor(absVal);
            double m = (absVal - d) * 60.0;
            string mStr = m.ToString("0.0").PadLeft(4, '0');

            string suffix = "";
            if (type == "lat") suffix = val >= 0 ? "N" : "S";
            if (type == "lon") suffix = val >= 0 ? "E" : "W";

            return string.IsNullOrEmpty(suffix)
                ? $"{d}° {mStr}'"
                : $"{d}° {mStr}' {suffix}";
        }

        /// <summary>
        /// 入力された度・分 → 10進数
        /// </summary>
        public static double ToDecimal(int d, double m, int sign = 1)
        {
            return (d + m / 60.0) * sign;
        }

        /// <summary>
        /// 10進数 → 度・分・秒オブジェクト
        /// </summary>
        public static (int D, int M, double S, int Sign) ToDMS(double degVal)
        {
            int d = (int)Math.Floor(Math.Abs(degVal));
            double minFloat = (Math.Abs(degVal) - d) * 60.0;
            int m = (int)Math.Floor(minFloat);
            double s = Math.Round((minFloat - m) * 60.0 * 10.0) / 10.0;
            int sign = degVal >= 0 ? 1 : -1;
            return (d, m, s, sign);
        }

        /// <summary>
        /// 真高度の計算
        /// </summary>
        public static double CalculateTrueAltitude(double hs, double corr)
        {
            return hs + (corr / 60.0);
        }

        /// <summary>
        /// 航程計算 (Run - Middle Latitude Sailing)
        /// </summary>
        public static (double DLat, double Dep, double DLong, double Lat2, double MeanLat)
            CalculateRun(double lat1, double course, double dist)
        {
            double dLat = dist * Math.Cos(Rad(course)) / 60.0;
            double lat2 = lat1 + dLat;
            double meanLat = (lat1 + lat2) / 2.0;
            double dep = dist * Math.Sin(Rad(course));
            double div = Math.Cos(Rad(meanLat));
            double dLong = Math.Abs(div) < 1e-6 ? 0.0 : (dep / div) / 60.0;

            return (dLat, dep, dLong, lat2, meanLat);
        }

        /// <summary>
        /// 計算高度と方位角 (Sight Reduction)
        /// </summary>
        public static (double Hc, double Z) CalculateSightReduction(double lat, double dec, double lha)
        {
            double latR = Rad(lat);
            double decR = Rad(dec);
            double lhaR = Rad(lha);

            double sinHc = Math.Sin(latR) * Math.Sin(decR) + Math.Cos(latR) * Math.Cos(decR) * Math.Cos(lhaR);
            double hcR = Math.Asin(sinHc);
            double hc = Deg(hcR);

            double cosZ = (Math.Sin(decR) - Math.Sin(latR) * sinHc) / (Math.Cos(latR) * Math.Cos(hcR));
            cosZ = Math.Max(-1.0, Math.Min(1.0, cosZ));
            double z = Deg(Math.Acos(cosZ));

            if (Math.Sin(lhaR) > 0)
                z = 360.0 - z;

            return (hc, z);
        }

        /// <summary>
        /// メリパス経度改正
        /// </summary>
        public static (double DepCorr, double DLongCorr)
            CalculateMeripass(double intercept, double azimuth, double deltaLMiles, double lat0)
        {
            double zr = Rad(azimuth);
            double tanZ = Math.Tan(zr);
            double sinZ = Math.Sin(zr);

            if (Math.Abs(sinZ) < 1e-6 || Math.Abs(tanZ) < 1e-6)
                return (0.0, 0.0);

            double term1 = intercept / sinZ;
            double term2 = deltaLMiles / tanZ;
            double depCorr = term1 - term2;
            double dLongCorr = depCorr / Math.Cos(Rad(lat0));

            return (depCorr, dLongCorr);
        }

        /// <summary>
        /// 出没方位角計算
        /// </summary>
        public static double CalculateAmplitude(double lat, double dec)
        {
            double latR = Rad(lat);
            double decR = Rad(dec);
            double cosZ = Math.Sin(decR) / Math.Cos(latR);
            cosZ = Math.Max(-1.0, Math.Min(1.0, cosZ));
            return Deg(Math.Acos(cosZ));
        }

        /// <summary>
        /// ジャイロ誤差計算
        /// </summary>
        public static double CalculateGyroError(double trueAzimuth, double gyroAzimuth)
        {
            double diff = trueAzimuth - gyroAzimuth;
            while (diff > 180) diff -= 360;
            while (diff < -180) diff += 360;
            return diff;
        }
    }
}
