using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot2
{
    public class SetDriftViewModel : CalculatorViewModelBase
    {
        private double _shipCourse, _shipSpeed, _cmg, _smg;
        private double _setDir, _drift;

        public double ShipCourse { get => _shipCourse; set => SetProperty(ref _shipCourse, value); }
        public double ShipSpeed { get => _shipSpeed; set => SetProperty(ref _shipSpeed, value); }
        public double Cmg { get => _cmg; set => SetProperty(ref _cmg, value); }
        public double Smg { get => _smg; set => SetProperty(ref _smg, value); }
        public double SetDir { get => _setDir; set => SetProperty(ref _setDir, value); }
        public double Drift { get => _drift; set => SetProperty(ref _drift, value); }

        public SetDriftViewModel() : base("set-drift", "流向・流速", "Set & Drift") { }

        protected override void ExecuteCalculation()
        {
            var r = CurrentVector.SetAndDrift(ShipCourse, ShipSpeed, Cmg, Smg);
            SetDir = r.SetDir; Drift = r.Drift;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            ShipCourse = ShipSpeed = Cmg = Smg = 0;
            SetDir = Drift = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "流向・流速", "PILOT 2");
            AddReportRow(ds, "入力", "船首方位", $"{ShipCourse:F1}°", sortOrder: 1);
            AddReportRow(ds, "入力", "船速", $"{ShipSpeed:F1} kn", sortOrder: 2);
            AddReportRow(ds, "入力", "実航針路 (CMG)", $"{Cmg:F1}°", sortOrder: 3);
            AddReportRow(ds, "入力", "実航速力 (SMG)", $"{Smg:F1} kn", sortOrder: 4);
            AddReportRow(ds, "結果", "流向", $"{SetDir:F1}°", true, 5);
            AddReportRow(ds, "結果", "流速", $"{Drift:F1} kn", true, 6);
            return ds;
        }
    }
}
