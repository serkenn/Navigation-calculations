namespace NavCalc.Core.Models
{
    public class DMSValue
    {
        public int Degrees { get; set; }
        public double Minutes { get; set; }
        public int Direction { get; set; } = 1; // 1 or -1

        public double ToDecimal()
        {
            return (Degrees + Minutes / 60.0) * Direction;
        }

        public static DMSValue FromDecimal(double value, string type = "angle")
        {
            double abs = System.Math.Abs(value);
            int d = (int)System.Math.Floor(abs);
            double m = (abs - d) * 60.0;
            int dir = value >= 0 ? 1 : -1;
            return new DMSValue { Degrees = d, Minutes = m, Direction = dir };
        }
    }

    public class Position
    {
        public DMSValue Lat { get; set; } = new DMSValue();
        public DMSValue Lon { get; set; } = new DMSValue();

        public double LatDecimal => Lat.ToDecimal();
        public double LonDecimal => Lon.ToDecimal();
    }
}
