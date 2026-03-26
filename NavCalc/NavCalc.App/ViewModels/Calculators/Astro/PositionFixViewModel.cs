using System;
using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Astro
{
    public class PositionFixViewModel : CalculatorViewModelBase
    {
        // DR Position
        private double _drLatDeg, _drLatMin;
        private int _drLatDirIndex;
        private double _drLonDeg, _drLonMin;
        private int _drLonDirIndex;

        // LOP 1
        private double _intercept1, _azimuth1;

        // LOP 2
        private double _intercept2, _azimuth2;

        // Results
        private double _fixLat, _fixLon;
        private string _fixLatFormatted = "", _fixLonFormatted = "";

        public double DrLatDeg { get => _drLatDeg; set => SetProperty(ref _drLatDeg, value); }
        public double DrLatMin { get => _drLatMin; set => SetProperty(ref _drLatMin, value); }
        public int DrLatDirIndex { get => _drLatDirIndex; set => SetProperty(ref _drLatDirIndex, value); }
        public double DrLonDeg { get => _drLonDeg; set => SetProperty(ref _drLonDeg, value); }
        public double DrLonMin { get => _drLonMin; set => SetProperty(ref _drLonMin, value); }
        public int DrLonDirIndex { get => _drLonDirIndex; set => SetProperty(ref _drLonDirIndex, value); }

        public double Intercept1 { get => _intercept1; set => SetProperty(ref _intercept1, value); }
        public double Azimuth1 { get => _azimuth1; set => SetProperty(ref _azimuth1, value); }
        public double Intercept2 { get => _intercept2; set => SetProperty(ref _intercept2, value); }
        public double Azimuth2 { get => _azimuth2; set => SetProperty(ref _azimuth2, value); }

        public double FixLat { get => _fixLat; set => SetProperty(ref _fixLat, value); }
        public double FixLon { get => _fixLon; set => SetProperty(ref _fixLon, value); }
        public string FixLatFormatted { get => _fixLatFormatted; set => SetProperty(ref _fixLatFormatted, value); }
        public string FixLonFormatted { get => _fixLonFormatted; set => SetProperty(ref _fixLonFormatted, value); }

        public PositionFixViewModel() : base("position-fix", "船位決定", "Position Fix (Two LOPs)") { }

        private double ToDec(double deg, double min, int dirIndex)
        {
            return (deg + min / 60.0) * (dirIndex == 0 ? 1 : -1);
        }

        protected override void ExecuteCalculation()
        {
            double drLat = ToDec(DrLatDeg, DrLatMin, DrLatDirIndex);
            double drLon = ToDec(DrLonDeg, DrLonMin, DrLonDirIndex);

            double z1R = NavigationMath.Rad(Azimuth1);
            double z2R = NavigationMath.Rad(Azimuth2);

            double dLat = (Intercept1 * Math.Cos(z1R) + Intercept2 * Math.Cos(z2R)) / 60.0;
            double cosLat = Math.Cos(NavigationMath.Rad(drLat));
            double dLon = cosLat > 1e-6
                ? ((Intercept1 * Math.Sin(z1R) + Intercept2 * Math.Sin(z2R)) / cosLat) / 60.0
                : 0.0;

            FixLat = drLat + dLat;
            FixLon = drLon + dLon;

            FixLatFormatted = NavigationMath.FormatDMS(FixLat, "lat");
            FixLonFormatted = NavigationMath.FormatDMS(FixLon, "lon");

            HasResult = true;
        }

        protected override void ClearInputs()
        {
            DrLatDeg = DrLatMin = DrLonDeg = DrLonMin = 0;
            DrLatDirIndex = DrLonDirIndex = 0;
            Intercept1 = Azimuth1 = Intercept2 = Azimuth2 = 0;
            FixLat = FixLon = 0;
            FixLatFormatted = FixLonFormatted = "";
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "船位決定", "ASTRO");
            AddReportRow(ds, "入力", "DR緯度", $"{DrLatDeg:F0}° {DrLatMin:F1}' {(DrLatDirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "DR経度", $"{DrLonDeg:F0}° {DrLonMin:F1}' {(DrLonDirIndex == 0 ? "E" : "W")}", sortOrder: 2);
            AddReportRow(ds, "入力", "修正差1", $"{Intercept1:F1}'", sortOrder: 3);
            AddReportRow(ds, "入力", "方位1", $"{Azimuth1:F1}°", sortOrder: 4);
            AddReportRow(ds, "入力", "修正差2", $"{Intercept2:F1}'", sortOrder: 5);
            AddReportRow(ds, "入力", "方位2", $"{Azimuth2:F1}°", sortOrder: 6);
            AddReportRow(ds, "結果", "船位緯度", FixLatFormatted, true, 7);
            AddReportRow(ds, "結果", "船位経度", FixLonFormatted, true, 8);
            return ds;
        }
    }
}
