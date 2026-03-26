using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.TimeCalc
{
    public class ToDecimalViewModel : CalculatorViewModelBase
    {
        private int _hours, _minutes, _seconds;
        private double _result;

        public int Hours { get => _hours; set => SetProperty(ref _hours, value); }
        public int Minutes { get => _minutes; set => SetProperty(ref _minutes, value); }
        public int Seconds { get => _seconds; set => SetProperty(ref _seconds, value); }
        public double Result { get => _result; set => SetProperty(ref _result, value); }

        public ToDecimalViewModel() : base("to-decimal", "10進数時変換", "To Decimal") { }

        protected override void ExecuteCalculation()
        {
            Result = TimeConversion.HMSToDecimal(Hours, Minutes, Seconds);
            HasResult = true;
        }

        protected override void ClearInputs() { Hours = Minutes = Seconds = 0; Result = 0; }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "10進数時変換", "TIME Calc");
            AddReportRow(ds, "入力", "時分秒", $"{Hours}h {Minutes}m {Seconds}s", sortOrder: 1);
            AddReportRow(ds, "結果", "10進数", $"{Result:F6}", true, 2);
            return ds;
        }
    }
}
