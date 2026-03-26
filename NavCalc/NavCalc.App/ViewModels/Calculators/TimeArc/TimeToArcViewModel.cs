using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.TimeArc
{
    public class TimeToArcViewModel : CalculatorViewModelBase
    {
        private int _hours, _minutes, _seconds;
        private int _resDeg, _resMin;
        private double _resSec, _resTotalDegrees;

        public int Hours { get => _hours; set => SetProperty(ref _hours, value); }
        public int Minutes { get => _minutes; set => SetProperty(ref _minutes, value); }
        public int Seconds { get => _seconds; set => SetProperty(ref _seconds, value); }

        public int ResDeg { get => _resDeg; set => SetProperty(ref _resDeg, value); }
        public int ResMin { get => _resMin; set => SetProperty(ref _resMin, value); }
        public double ResSec { get => _resSec; set => SetProperty(ref _resSec, value); }
        public double ResTotalDegrees { get => _resTotalDegrees; set => SetProperty(ref _resTotalDegrees, value); }

        public TimeToArcViewModel() : base("time-to-arc", "時間→弧度", "Time to Arc") { }

        protected override void ExecuteCalculation()
        {
            var r = TimeConversion.TimeToArc(Hours, Minutes, Seconds);
            ResDeg = r.Deg; ResMin = r.Min; ResSec = r.Sec; ResTotalDegrees = r.TotalDegrees;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Hours = Minutes = Seconds = 0;
            ResDeg = ResMin = 0; ResSec = ResTotalDegrees = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "時間→弧度", "TIME & ARC");
            AddReportRow(ds, "入力", "時間", $"{Hours}h {Minutes}m {Seconds}s", sortOrder: 1);
            AddReportRow(ds, "結果", "弧度", $"{ResDeg}° {ResMin}' {ResSec:F1}\"", true, 2);
            AddReportRow(ds, "結果", "10進度", $"{ResTotalDegrees:F4}°", sortOrder: 3);
            return ds;
        }
    }
}
