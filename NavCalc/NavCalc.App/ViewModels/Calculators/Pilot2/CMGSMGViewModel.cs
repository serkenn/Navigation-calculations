using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot2
{
    public class CMGSMGViewModel : CalculatorViewModelBase
    {
        private double _shipCourse, _shipSpeed, _setDir, _driftSpeed;
        private double _cmg, _smg;

        public double ShipCourse { get => _shipCourse; set => SetProperty(ref _shipCourse, value); }
        public double ShipSpeed { get => _shipSpeed; set => SetProperty(ref _shipSpeed, value); }
        public double SetDir { get => _setDir; set => SetProperty(ref _setDir, value); }
        public double DriftSpeed { get => _driftSpeed; set => SetProperty(ref _driftSpeed, value); }
        public double Cmg { get => _cmg; set => SetProperty(ref _cmg, value); }
        public double Smg { get => _smg; set => SetProperty(ref _smg, value); }

        public CMGSMGViewModel() : base("cmg-smg", "実航針路・速力", "CMG / SMG") { }

        protected override void ExecuteCalculation()
        {
            var r = CurrentVector.CmgSmg(ShipCourse, ShipSpeed, SetDir, DriftSpeed);
            Cmg = r.Cmg; Smg = r.Smg;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            ShipCourse = ShipSpeed = SetDir = DriftSpeed = 0;
            Cmg = Smg = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "実航針路・速力", "PILOT 2");
            AddReportRow(ds, "入力", "船首方位", $"{ShipCourse:F1}°", sortOrder: 1);
            AddReportRow(ds, "入力", "船速", $"{ShipSpeed:F1} kn", sortOrder: 2);
            AddReportRow(ds, "入力", "流向", $"{SetDir:F1}°", sortOrder: 3);
            AddReportRow(ds, "入力", "流速", $"{DriftSpeed:F1} kn", sortOrder: 4);
            AddReportRow(ds, "結果", "実航針路 (CMG)", $"{Cmg:F1}°", true, 5);
            AddReportRow(ds, "結果", "実航速力 (SMG)", $"{Smg:F1} kn", true, 6);
            return ds;
        }
    }
}
