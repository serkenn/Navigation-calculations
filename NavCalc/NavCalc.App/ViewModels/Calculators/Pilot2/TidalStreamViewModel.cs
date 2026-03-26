using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot2
{
    public class TidalStreamViewModel : CalculatorViewModelBase
    {
        private double _rate1, _dir1, _rate2, _dir2, _fraction;
        private double _rate, _dir;

        public double Rate1 { get => _rate1; set => SetProperty(ref _rate1, value); }
        public double Dir1 { get => _dir1; set => SetProperty(ref _dir1, value); }
        public double Rate2 { get => _rate2; set => SetProperty(ref _rate2, value); }
        public double Dir2 { get => _dir2; set => SetProperty(ref _dir2, value); }
        public double Fraction { get => _fraction; set => SetProperty(ref _fraction, value); }
        public double Rate { get => _rate; set => SetProperty(ref _rate, value); }
        public double Dir { get => _dir; set => SetProperty(ref _dir, value); }

        public TidalStreamViewModel() : base("tidal-stream", "潮流計算", "Tidal Stream") { }

        protected override void ExecuteCalculation()
        {
            var r = Tide.TidalStream(Rate1, Dir1, Rate2, Dir2, Fraction);
            Rate = r.Rate; Dir = r.Dir;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Rate1 = Dir1 = Rate2 = Dir2 = Fraction = 0;
            Rate = Dir = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "潮流計算", "PILOT 2");
            AddReportRow(ds, "入力", "流速1", $"{Rate1:F1} kn", sortOrder: 1);
            AddReportRow(ds, "入力", "流向1", $"{Dir1:F1}°", sortOrder: 2);
            AddReportRow(ds, "入力", "流速2", $"{Rate2:F1} kn", sortOrder: 3);
            AddReportRow(ds, "入力", "流向2", $"{Dir2:F1}°", sortOrder: 4);
            AddReportRow(ds, "入力", "内挿比", $"{Fraction:F2}", sortOrder: 5);
            AddReportRow(ds, "結果", "流速", $"{Rate:F1} kn", true, 6);
            AddReportRow(ds, "結果", "流向", $"{Dir:F1}°", true, 7);
            return ds;
        }
    }
}
