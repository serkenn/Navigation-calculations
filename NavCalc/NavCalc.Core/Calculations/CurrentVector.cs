using System;
using static NavCalc.Core.Calculations.NavigationMath;

namespace NavCalc.Core.Calculations
{
    public static class CurrentVector
    {
        /// <summary>
        /// 実航針路・実航速力 (CMG/SMG)
        /// </summary>
        public static (double Cmg, double Smg) CmgSmg(
            double shipCourse, double shipSpeed, double setDir, double driftSpeed)
        {
            double sc = Rad(shipCourse), sd = Rad(setDir);
            double vx = shipSpeed * Math.Sin(sc) + driftSpeed * Math.Sin(sd);
            double vy = shipSpeed * Math.Cos(sc) + driftSpeed * Math.Cos(sd);

            double smg = Math.Sqrt(vx * vx + vy * vy);
            double cmg = Deg(Math.Atan2(vx, vy));
            if (cmg < 0) cmg += 360.0;

            return (cmg, smg);
        }

        /// <summary>
        /// 視針路・対水速力 (Course to Steer / Speed through Water)
        /// </summary>
        public static (double ShipCourse, double ShipSpeed) CourseToSteer(
            double requiredCMG, double requiredSMG, double setDir, double driftSpeed)
        {
            double cmgR = Rad(requiredCMG), sdR = Rad(setDir);
            double gx = requiredSMG * Math.Sin(cmgR);
            double gy = requiredSMG * Math.Cos(cmgR);
            double cx = driftSpeed * Math.Sin(sdR);
            double cy = driftSpeed * Math.Cos(sdR);

            double sx = gx - cx;
            double sy = gy - cy;

            double shipSpeed = Math.Sqrt(sx * sx + sy * sy);
            double shipCourse = Deg(Math.Atan2(sx, sy));
            if (shipCourse < 0) shipCourse += 360.0;

            return (shipCourse, shipSpeed);
        }

        /// <summary>
        /// 視針路・実航速力 (Course to Steer & SMG)
        /// </summary>
        public static (double ShipCourse, double Smg, bool Possible) CourseToSteerSMG(
            double requiredCMG, double shipSpeed, double setDir, double driftSpeed)
        {
            double cmgR = Rad(requiredCMG), sdR = Rad(setDir);
            double alpha = sdR - cmgR;
            double sinBeta = (driftSpeed / shipSpeed) * Math.Sin(alpha);

            if (Math.Abs(sinBeta) > 1)
                return (double.NaN, double.NaN, false);

            double beta = Math.Asin(sinBeta);
            double shipCourse = requiredCMG + Deg(beta);
            if (shipCourse < 0) shipCourse += 360.0;
            if (shipCourse >= 360) shipCourse -= 360.0;

            double gamma = Math.PI - alpha - beta;
            double sinAlpha = Math.Sin(alpha);
            double smg = shipSpeed * Math.Sin(gamma) / (Math.Abs(sinAlpha) < 1e-10 ? 1e-10 : sinAlpha);

            return (shipCourse, Math.Abs(smg), true);
        }

        /// <summary>
        /// 流向・流速 (Set & Drift)
        /// </summary>
        public static (double SetDir, double Drift) SetAndDrift(
            double shipCourse, double shipSpeed, double cmg, double smg)
        {
            double scR = Rad(shipCourse), cmgR = Rad(cmg);
            double cx = smg * Math.Sin(cmgR) - shipSpeed * Math.Sin(scR);
            double cy = smg * Math.Cos(cmgR) - shipSpeed * Math.Cos(scR);

            double drift = Math.Sqrt(cx * cx + cy * cy);
            double setDir = Deg(Math.Atan2(cx, cy));
            if (setDir < 0) setDir += 360.0;

            return (setDir, drift);
        }
    }
}
