using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Astro
{
    public class NauticalAlmanacViewModel : CalculatorViewModelBase
    {
        private int _year, _month, _day, _utcH, _utcM;

        private string _ghaFormatted = "", _decFormatted = "";
        private string _raFormatted = "", _eqTimeFormatted = "", _gmstFormatted = "";
        private double _gha, _dec, _ra, _eqTime, _gmst;

        public int Year { get => _year; set => SetProperty(ref _year, value); }
        public int Month { get => _month; set => SetProperty(ref _month, value); }
        public int Day { get => _day; set => SetProperty(ref _day, value); }
        public int UtcH { get => _utcH; set => SetProperty(ref _utcH, value); }
        public int UtcM { get => _utcM; set => SetProperty(ref _utcM, value); }

        public double Gha { get => _gha; set => SetProperty(ref _gha, value); }
        public double Dec { get => _dec; set => SetProperty(ref _dec, value); }
        public double Ra { get => _ra; set => SetProperty(ref _ra, value); }
        public double EqTime { get => _eqTime; set => SetProperty(ref _eqTime, value); }
        public double Gmst { get => _gmst; set => SetProperty(ref _gmst, value); }

        public string GhaFormatted { get => _ghaFormatted; set => SetProperty(ref _ghaFormatted, value); }
        public string DecFormatted { get => _decFormatted; set => SetProperty(ref _decFormatted, value); }
        public string RaFormatted { get => _raFormatted; set => SetProperty(ref _raFormatted, value); }
        public string EqTimeFormatted { get => _eqTimeFormatted; set => SetProperty(ref _eqTimeFormatted, value); }
        public string GmstFormatted { get => _gmstFormatted; set => SetProperty(ref _gmstFormatted, value); }

        public NauticalAlmanacViewModel() : base("nautical-almanac", "天測暦", "Nautical Almanac") { }

        protected override void ExecuteCalculation()
        {
            double utcHours = UtcH + UtcM / 60.0;
            var result = Ephemeris.SolarPosition(Year, Month, Day, utcHours);

            Gha = result.Gha;
            Dec = result.Dec;
            Ra = result.Ra;
            EqTime = result.EqTime;
            Gmst = result.Gmst;

            GhaFormatted = NavigationMath.FormatDMS(result.Gha);
            DecFormatted = NavigationMath.FormatDMS(result.Dec);
            RaFormatted = NavigationMath.FormatDMS(result.Ra);
            EqTimeFormatted = $"{result.EqTime:F2} min";
            GmstFormatted = NavigationMath.FormatDMS(result.Gmst);

            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Year = Month = Day = UtcH = UtcM = 0;
            Gha = Dec = Ra = EqTime = Gmst = 0;
            GhaFormatted = DecFormatted = RaFormatted = EqTimeFormatted = GmstFormatted = "";
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "天測暦", "ASTRO");
            AddReportRow(ds, "入力", "日付", $"{Year}/{Month:D2}/{Day:D2}", sortOrder: 1);
            AddReportRow(ds, "入力", "UTC", $"{UtcH:D2}:{UtcM:D2}", sortOrder: 2);
            AddReportRow(ds, "結果", "GHA", GhaFormatted, true, 3);
            AddReportRow(ds, "結果", "Dec", DecFormatted, true, 4);
            AddReportRow(ds, "結果", "RA", RaFormatted, false, 5);
            AddReportRow(ds, "結果", "均時差", EqTimeFormatted, false, 6);
            AddReportRow(ds, "結果", "GMST", GmstFormatted, false, 7);
            return ds;
        }
    }
}
