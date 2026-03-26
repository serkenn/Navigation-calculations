using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot2
{
    public class TrueWindViewModel : CalculatorViewModelBase
    {
        private double _relativeDir, _relativeSpeed, _shipCourse, _shipSpeed;
        private double _trueDir, _trueSpeed;

        public double RelativeDir { get => _relativeDir; set => SetProperty(ref _relativeDir, value); }
        public double RelativeSpeed { get => _relativeSpeed; set => SetProperty(ref _relativeSpeed, value); }
        public double ShipCourse { get => _shipCourse; set => SetProperty(ref _shipCourse, value); }
        public double ShipSpeed { get => _shipSpeed; set => SetProperty(ref _shipSpeed, value); }
        public double TrueDir { get => _trueDir; set => SetProperty(ref _trueDir, value); }
        public double TrueSpeed { get => _trueSpeed; set => SetProperty(ref _trueSpeed, value); }

        public TrueWindViewModel() : base("true-wind", "真風向・風速", "True Wind") { }

        protected override void ExecuteCalculation()
        {
            var r = Wind.TrueWind(RelativeDir, RelativeSpeed, ShipCourse, ShipSpeed);
            TrueDir = r.TrueDir; TrueSpeed = r.TrueSpeed;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            RelativeDir = RelativeSpeed = ShipCourse = ShipSpeed = 0;
            TrueDir = TrueSpeed = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "真風向・風速", "PILOT 2");
            AddReportRow(ds, "入力", "相対風向", $"{RelativeDir:F1}°", sortOrder: 1);
            AddReportRow(ds, "入力", "相対風速", $"{RelativeSpeed:F1} kn", sortOrder: 2);
            AddReportRow(ds, "入力", "船首方位", $"{ShipCourse:F1}°", sortOrder: 3);
            AddReportRow(ds, "入力", "船速", $"{ShipSpeed:F1} kn", sortOrder: 4);
            AddReportRow(ds, "結果", "真風向", $"{TrueDir:F1}°", true, 5);
            AddReportRow(ds, "結果", "真風速", $"{TrueSpeed:F1} kn", true, 6);
            return ds;
        }
    }
}
