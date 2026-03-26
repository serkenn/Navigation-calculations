using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.TimeArc
{
    public class ArcToTimeViewModel : CalculatorViewModelBase
    {
        private int _degrees, _minutes, _seconds;
        private int _resH, _resM;
        private double _resS, _resTotalHours;

        public int Degrees { get => _degrees; set => SetProperty(ref _degrees, value); }
        public int Minutes { get => _minutes; set => SetProperty(ref _minutes, value); }
        public int Seconds { get => _seconds; set => SetProperty(ref _seconds, value); }

        public int ResH { get => _resH; set => SetProperty(ref _resH, value); }
        public int ResM { get => _resM; set => SetProperty(ref _resM, value); }
        public double ResS { get => _resS; set => SetProperty(ref _resS, value); }
        public double ResTotalHours { get => _resTotalHours; set => SetProperty(ref _resTotalHours, value); }

        public ArcToTimeViewModel() : base("arc-to-time", "弧度→時間", "Arc to Time") { }

        protected override void ExecuteCalculation()
        {
            var r = TimeConversion.ArcToTime(Degrees, Minutes, Seconds);
            ResH = r.H; ResM = r.M; ResS = r.S; ResTotalHours = r.TotalHours;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Degrees = Minutes = Seconds = 0;
            ResH = ResM = 0; ResS = ResTotalHours = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "弧度→時間", "TIME & ARC");
            AddReportRow(ds, "入力", "弧度", $"{Degrees}° {Minutes}' {Seconds}\"", sortOrder: 1);
            AddReportRow(ds, "結果", "時間", $"{ResH}h {ResM}m {ResS:F1}s", true, 2);
            AddReportRow(ds, "結果", "10進時", $"{ResTotalHours:F4}h", sortOrder: 3);
            return ds;
        }
    }
}
