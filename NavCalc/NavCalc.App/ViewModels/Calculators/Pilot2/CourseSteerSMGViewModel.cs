using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot2
{
    public class CourseSteerSMGViewModel : CalculatorViewModelBase
    {
        private double _requiredCMG, _shipSpeed, _setDir, _driftSpeed;
        private double _shipCourse, _smg;
        private bool _possible;

        public double RequiredCMG { get => _requiredCMG; set => SetProperty(ref _requiredCMG, value); }
        public double ShipSpeed { get => _shipSpeed; set => SetProperty(ref _shipSpeed, value); }
        public double SetDir { get => _setDir; set => SetProperty(ref _setDir, value); }
        public double DriftSpeed { get => _driftSpeed; set => SetProperty(ref _driftSpeed, value); }
        public double ShipCourse { get => _shipCourse; set => SetProperty(ref _shipCourse, value); }
        public double Smg { get => _smg; set => SetProperty(ref _smg, value); }
        public bool Possible { get => _possible; set => SetProperty(ref _possible, value); }

        public CourseSteerSMGViewModel() : base("course-steer-smg", "視針路・実航速力", "Course to Steer & SMG") { }

        protected override void ExecuteCalculation()
        {
            var r = CurrentVector.CourseToSteerSMG(RequiredCMG, ShipSpeed, SetDir, DriftSpeed);
            ShipCourse = r.ShipCourse; Smg = r.Smg; Possible = r.Possible;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            RequiredCMG = ShipSpeed = SetDir = DriftSpeed = 0;
            ShipCourse = Smg = 0;
            Possible = false;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "視針路・実航速力", "PILOT 2");
            AddReportRow(ds, "入力", "必要CMG", $"{RequiredCMG:F1}°", sortOrder: 1);
            AddReportRow(ds, "入力", "船速", $"{ShipSpeed:F1} kn", sortOrder: 2);
            AddReportRow(ds, "入力", "流向", $"{SetDir:F1}°", sortOrder: 3);
            AddReportRow(ds, "入力", "流速", $"{DriftSpeed:F1} kn", sortOrder: 4);
            AddReportRow(ds, "結果", "視針路", $"{ShipCourse:F1}°", true, 5);
            AddReportRow(ds, "結果", "実航速力 (SMG)", $"{Smg:F1} kn", true, 6);
            AddReportRow(ds, "結果", "解の有無", Possible ? "可能" : "不可能", true, 7);
            return ds;
        }
    }
}
