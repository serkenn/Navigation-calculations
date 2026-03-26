using System;
using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Astro
{
    public class TwilightViewModel : CalculatorViewModelBase
    {
        private double _latDeg, _latMin;
        private int _latDirIndex;
        private double _lonDeg, _lonMin;
        private int _lonDirIndex;
        private double _decDeg, _decMin;
        private int _decDirIndex;
        private double _eqTime;

        private string _sunriseRise = "", _sunriseSet = "";
        private string _civilRise = "", _civilSet = "";
        private string _nauticalRise = "", _nauticalSet = "";
        private string _astroRise = "", _astroSet = "";

        public double LatDeg { get => _latDeg; set => SetProperty(ref _latDeg, value); }
        public double LatMin { get => _latMin; set => SetProperty(ref _latMin, value); }
        public int LatDirIndex { get => _latDirIndex; set => SetProperty(ref _latDirIndex, value); }
        public double LonDeg { get => _lonDeg; set => SetProperty(ref _lonDeg, value); }
        public double LonMin { get => _lonMin; set => SetProperty(ref _lonMin, value); }
        public int LonDirIndex { get => _lonDirIndex; set => SetProperty(ref _lonDirIndex, value); }
        public double DecDeg { get => _decDeg; set => SetProperty(ref _decDeg, value); }
        public double DecMin { get => _decMin; set => SetProperty(ref _decMin, value); }
        public int DecDirIndex { get => _decDirIndex; set => SetProperty(ref _decDirIndex, value); }
        public double EqTime { get => _eqTime; set => SetProperty(ref _eqTime, value); }

        public string SunriseRise { get => _sunriseRise; set => SetProperty(ref _sunriseRise, value); }
        public string SunriseSet { get => _sunriseSet; set => SetProperty(ref _sunriseSet, value); }
        public string CivilRise { get => _civilRise; set => SetProperty(ref _civilRise, value); }
        public string CivilSet { get => _civilSet; set => SetProperty(ref _civilSet, value); }
        public string NauticalRise { get => _nauticalRise; set => SetProperty(ref _nauticalRise, value); }
        public string NauticalSet { get => _nauticalSet; set => SetProperty(ref _nauticalSet, value); }
        public string AstroRise { get => _astroRise; set => SetProperty(ref _astroRise, value); }
        public string AstroSet { get => _astroSet; set => SetProperty(ref _astroSet, value); }

        public TwilightViewModel() : base("twilight", "薄明計算", "Twilight Times") { }

        private double ToDec(double deg, double min, int dirIndex)
        {
            return (deg + min / 60.0) * (dirIndex == 0 ? 1 : -1);
        }

        private string FormatTime(double hours)
        {
            if (double.IsNaN(hours)) return "N/A";
            while (hours < 0) hours += 24.0;
            while (hours >= 24) hours -= 24.0;
            int h = (int)Math.Floor(hours);
            int m = (int)Math.Floor((hours - h) * 60.0);
            int s = (int)Math.Round(((hours - h) * 60.0 - m) * 60.0);
            if (s == 60) { s = 0; m++; }
            if (m == 60) { m = 0; h++; }
            return $"{h:D2}:{m:D2}:{s:D2}";
        }

        protected override void ExecuteCalculation()
        {
            double lat = ToDec(LatDeg, LatMin, LatDirIndex);
            double lon = ToDec(LonDeg, LonMin, LonDirIndex);
            double dec = ToDec(DecDeg, DecMin, DecDirIndex);

            var result = Astronomy.AllTwilights(lat, dec, lon, EqTime);

            SunriseRise = FormatTime(result.Sunrise.Rise);
            SunriseSet = FormatTime(result.Sunrise.Set);
            CivilRise = FormatTime(result.Civil.Rise);
            CivilSet = FormatTime(result.Civil.Set);
            NauticalRise = FormatTime(result.Nautical.Rise);
            NauticalSet = FormatTime(result.Nautical.Set);
            AstroRise = FormatTime(result.Astronomical.Rise);
            AstroSet = FormatTime(result.Astronomical.Set);

            HasResult = true;
        }

        protected override void ClearInputs()
        {
            LatDeg = LatMin = LonDeg = LonMin = DecDeg = DecMin = 0;
            LatDirIndex = LonDirIndex = DecDirIndex = 0;
            EqTime = 0;
            SunriseRise = SunriseSet = "";
            CivilRise = CivilSet = "";
            NauticalRise = NauticalSet = "";
            AstroRise = AstroSet = "";
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "薄明計算", "ASTRO");
            AddReportRow(ds, "入力", "緯度", $"{LatDeg:F0}° {LatMin:F1}' {(LatDirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "経度", $"{LonDeg:F0}° {LonMin:F1}' {(LonDirIndex == 0 ? "E" : "W")}", sortOrder: 2);
            AddReportRow(ds, "入力", "赤緯", $"{DecDeg:F0}° {DecMin:F1}' {(DecDirIndex == 0 ? "N" : "S")}", sortOrder: 3);
            AddReportRow(ds, "入力", "均時差", $"{EqTime:F2} min", sortOrder: 4);
            AddReportRow(ds, "結果", "日出", SunriseRise, true, 5);
            AddReportRow(ds, "結果", "日没", SunriseSet, true, 6);
            AddReportRow(ds, "結果", "常用薄明(始)", CivilRise, false, 7);
            AddReportRow(ds, "結果", "常用薄明(終)", CivilSet, false, 8);
            AddReportRow(ds, "結果", "航海薄明(始)", NauticalRise, false, 9);
            AddReportRow(ds, "結果", "航海薄明(終)", NauticalSet, false, 10);
            AddReportRow(ds, "結果", "天文薄明(始)", AstroRise, false, 11);
            AddReportRow(ds, "結果", "天文薄明(終)", AstroSet, false, 12);
            return ds;
        }
    }
}
