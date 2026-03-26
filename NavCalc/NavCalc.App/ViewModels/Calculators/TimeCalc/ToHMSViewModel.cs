using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.TimeCalc
{
    public class ToHMSViewModel : CalculatorViewModelBase
    {
        private double _decimalHours;
        private int _resH, _resM;
        private double _resS;
        private string _resSign = "";

        public double DecimalHours { get => _decimalHours; set => SetProperty(ref _decimalHours, value); }
        public int ResH { get => _resH; set => SetProperty(ref _resH, value); }
        public int ResM { get => _resM; set => SetProperty(ref _resM, value); }
        public double ResS { get => _resS; set => SetProperty(ref _resS, value); }
        public string ResSign { get => _resSign; set => SetProperty(ref _resSign, value); }

        public ToHMSViewModel() : base("to-hms", "時分秒変換", "To HMS") { }

        protected override void ExecuteCalculation()
        {
            var r = TimeConversion.DecimalToHMS(DecimalHours);
            ResH = r.H; ResM = r.M; ResS = r.S;
            ResSign = r.Sign < 0 ? "-" : "";
            HasResult = true;
        }

        protected override void ClearInputs() { DecimalHours = 0; ResH = ResM = 0; ResS = 0; ResSign = ""; }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "時分秒変換", "TIME Calc");
            AddReportRow(ds, "入力", "10進数", $"{DecimalHours:F4}", sortOrder: 1);
            AddReportRow(ds, "結果", "時分秒", $"{ResSign}{ResH}h {ResM}m {ResS:F1}s", true, 2);
            return ds;
        }
    }
}
