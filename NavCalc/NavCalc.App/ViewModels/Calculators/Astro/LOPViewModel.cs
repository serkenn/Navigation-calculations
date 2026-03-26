using System;
using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Astro
{
    public class LOPViewModel : CalculatorViewModelBase
    {
        // DR Position
        private double _drLatDeg, _drLatMin;
        private int _drLatDirIndex;
        private double _drLonDeg, _drLonMin;
        private int _drLonDirIndex;

        // Sextant altitude
        private double _hsDeg, _hsMin;
        private double _totalCorr;

        // GHA and Dec
        private double _ghaDeg, _ghaMin;
        private double _decDeg, _decMin;
        private int _decDirIndex;

        // Results
        private double _lha, _ho, _hc, _intercept, _azimuth;
        private string _hoFormatted = "", _hcFormatted = "";
        private string _interceptFormatted = "", _azimuthFormatted = "";
        private string _lhaFormatted = "";

        public double DrLatDeg { get => _drLatDeg; set => SetProperty(ref _drLatDeg, value); }
        public double DrLatMin { get => _drLatMin; set => SetProperty(ref _drLatMin, value); }
        public int DrLatDirIndex { get => _drLatDirIndex; set => SetProperty(ref _drLatDirIndex, value); }
        public double DrLonDeg { get => _drLonDeg; set => SetProperty(ref _drLonDeg, value); }
        public double DrLonMin { get => _drLonMin; set => SetProperty(ref _drLonMin, value); }
        public int DrLonDirIndex { get => _drLonDirIndex; set => SetProperty(ref _drLonDirIndex, value); }

        public double HsDeg { get => _hsDeg; set => SetProperty(ref _hsDeg, value); }
        public double HsMin { get => _hsMin; set => SetProperty(ref _hsMin, value); }
        public double TotalCorr { get => _totalCorr; set => SetProperty(ref _totalCorr, value); }

        public double GhaDeg { get => _ghaDeg; set => SetProperty(ref _ghaDeg, value); }
        public double GhaMin { get => _ghaMin; set => SetProperty(ref _ghaMin, value); }
        public double DecDeg { get => _decDeg; set => SetProperty(ref _decDeg, value); }
        public double DecMin { get => _decMin; set => SetProperty(ref _decMin, value); }
        public int DecDirIndex { get => _decDirIndex; set => SetProperty(ref _decDirIndex, value); }

        public double Lha { get => _lha; set => SetProperty(ref _lha, value); }
        public double Ho { get => _ho; set => SetProperty(ref _ho, value); }
        public double Hc { get => _hc; set => SetProperty(ref _hc, value); }
        public double Intercept { get => _intercept; set => SetProperty(ref _intercept, value); }
        public double Azimuth { get => _azimuth; set => SetProperty(ref _azimuth, value); }

        public string LhaFormatted { get => _lhaFormatted; set => SetProperty(ref _lhaFormatted, value); }
        public string HoFormatted { get => _hoFormatted; set => SetProperty(ref _hoFormatted, value); }
        public string HcFormatted { get => _hcFormatted; set => SetProperty(ref _hcFormatted, value); }
        public string InterceptFormatted { get => _interceptFormatted; set => SetProperty(ref _interceptFormatted, value); }
        public string AzimuthFormatted { get => _azimuthFormatted; set => SetProperty(ref _azimuthFormatted, value); }

        public LOPViewModel() : base("lop", "位置の線", "Line of Position") { }

        private double ToDec(double deg, double min, int dirIndex)
        {
            return (deg + min / 60.0) * (dirIndex == 0 ? 1 : -1);
        }

        protected override void ExecuteCalculation()
        {
            double lat = ToDec(DrLatDeg, DrLatMin, DrLatDirIndex);
            double lon = ToDec(DrLonDeg, DrLonMin, DrLonDirIndex);
            double hs = HsDeg + HsMin / 60.0;
            double ho = hs + TotalCorr / 60.0;
            double gha = GhaDeg + GhaMin / 60.0;
            double dec = ToDec(DecDeg, DecMin, DecDirIndex);

            double lha = gha - lon;
            while (lha < 0) lha += 360.0;
            while (lha >= 360) lha -= 360.0;

            var (hc, z) = NavigationMath.CalculateSightReduction(lat, dec, lha);

            double intercept = (ho - hc) * 60.0;

            Lha = lha;
            Ho = ho;
            Hc = hc;
            Intercept = intercept;
            Azimuth = z;

            LhaFormatted = NavigationMath.FormatDMS(lha);
            HoFormatted = NavigationMath.FormatDMS(ho);
            HcFormatted = NavigationMath.FormatDMS(hc);
            string direction = intercept >= 0 ? "T (Towards)" : "A (Away)";
            InterceptFormatted = $"{Math.Abs(intercept):F1}' {direction}";
            AzimuthFormatted = $"{z:F1}°";

            HasResult = true;
        }

        protected override void ClearInputs()
        {
            DrLatDeg = DrLatMin = DrLonDeg = DrLonMin = 0;
            DrLatDirIndex = DrLonDirIndex = 0;
            HsDeg = HsMin = TotalCorr = 0;
            GhaDeg = GhaMin = DecDeg = DecMin = 0;
            DecDirIndex = 0;
            Lha = Ho = Hc = Intercept = Azimuth = 0;
            LhaFormatted = HoFormatted = HcFormatted = InterceptFormatted = AzimuthFormatted = "";
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "位置の線", "ASTRO");
            AddReportRow(ds, "入力", "DR緯度", $"{DrLatDeg:F0}° {DrLatMin:F1}' {(DrLatDirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "DR経度", $"{DrLonDeg:F0}° {DrLonMin:F1}' {(DrLonDirIndex == 0 ? "E" : "W")}", sortOrder: 2);
            AddReportRow(ds, "入力", "Hs", $"{HsDeg:F0}° {HsMin:F1}'", sortOrder: 3);
            AddReportRow(ds, "入力", "改正量", $"{TotalCorr:F1}'", sortOrder: 4);
            AddReportRow(ds, "入力", "GHA", $"{GhaDeg:F0}° {GhaMin:F1}'", sortOrder: 5);
            AddReportRow(ds, "入力", "Dec", $"{DecDeg:F0}° {DecMin:F1}' {(DecDirIndex == 0 ? "N" : "S")}", sortOrder: 6);
            AddReportRow(ds, "結果", "LHA", LhaFormatted, true, 7);
            AddReportRow(ds, "結果", "Ho", HoFormatted, true, 8);
            AddReportRow(ds, "結果", "Hc", HcFormatted, true, 9);
            AddReportRow(ds, "結果", "修正差", InterceptFormatted, true, 10);
            AddReportRow(ds, "結果", "方位", AzimuthFormatted, true, 11);
            return ds;
        }
    }
}
