using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.TimeCalc
{
    public class ArithmeticViewModel : CalculatorViewModelBase
    {
        private int _h1, _m1, _s1, _h2, _m2, _s2;
        private char _op = '+';
        private int _resH, _resM;
        private double _resS, _resDecimal;
        private string _resSign = "";

        public int H1 { get => _h1; set => SetProperty(ref _h1, value); }
        public int M1 { get => _m1; set => SetProperty(ref _m1, value); }
        public int S1 { get => _s1; set => SetProperty(ref _s1, value); }
        public int H2 { get => _h2; set => SetProperty(ref _h2, value); }
        public int M2 { get => _m2; set => SetProperty(ref _m2, value); }
        public int S2 { get => _s2; set => SetProperty(ref _s2, value); }
        public char Op { get => _op; set => SetProperty(ref _op, value); }

        public int ResH { get => _resH; set => SetProperty(ref _resH, value); }
        public int ResM { get => _resM; set => SetProperty(ref _resM, value); }
        public double ResS { get => _resS; set => SetProperty(ref _resS, value); }
        public double ResDecimal { get => _resDecimal; set => SetProperty(ref _resDecimal, value); }
        public string ResSign { get => _resSign; set => SetProperty(ref _resSign, value); }

        public ArithmeticViewModel() : base("arithmetic", "四則計算", "Arithmetic") { }

        protected override void ExecuteCalculation()
        {
            var r = TimeConversion.HMSArithmetic(H1, M1, S1, Op, H2, M2, S2);
            ResH = r.H; ResM = r.M; ResS = r.S; ResDecimal = r.Decimal;
            ResSign = r.Sign < 0 ? "-" : "";
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            H1 = M1 = S1 = H2 = M2 = S2 = 0;
            Op = '+'; ResH = ResM = 0; ResS = ResDecimal = 0; ResSign = "";
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "四則計算", "TIME Calc");
            AddReportRow(ds, "入力", "値A", $"{H1}h {M1}m {S1}s", sortOrder: 1);
            AddReportRow(ds, "入力", "演算子", $"{Op}", sortOrder: 2);
            AddReportRow(ds, "入力", "値B", $"{H2}h {M2}m {S2}s", sortOrder: 3);
            AddReportRow(ds, "結果", "時分秒", $"{ResSign}{ResH}h {ResM}m {ResS:F1}s", true, 4);
            AddReportRow(ds, "結果", "10進数", $"{ResDecimal:F6}", sortOrder: 5);
            return ds;
        }
    }
}
