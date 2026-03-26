using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot2
{
    public class CourseToSteerViewModel : CalculatorViewModelBase
    {
        private double _requiredCMG, _requiredSMG, _setDir, _driftSpeed;
        private double _shipCourse, _shipSpeed;

        public double RequiredCMG { get => _requiredCMG; set => SetProperty(ref _requiredCMG, value); }
        public double RequiredSMG { get => _requiredSMG; set => SetProperty(ref _requiredSMG, value); }
        public double SetDir { get => _setDir; set => SetProperty(ref _setDir, value); }
        public double DriftSpeed { get => _driftSpeed; set => SetProperty(ref _driftSpeed, value); }
        public double ShipCourse { get => _shipCourse; set => SetProperty(ref _shipCourse, value); }
        public double ShipSpeed { get => _shipSpeed; set => SetProperty(ref _shipSpeed, value); }

        public CourseToSteerViewModel() : base("course-to-steer", "視針路・対水速力", "Course to Steer") { }

        protected override void ExecuteCalculation()
        {
            var r = CurrentVector.CourseToSteer(RequiredCMG, RequiredSMG, SetDir, DriftSpeed);
            ShipCourse = r.ShipCourse; ShipSpeed = r.ShipSpeed;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            RequiredCMG = RequiredSMG = SetDir = DriftSpeed = 0;
            ShipCourse = ShipSpeed = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "視針路・対水速力", "PILOT 2");
            AddReportRow(ds, "入力", "必要CMG", $"{RequiredCMG:F1}°", sortOrder: 1);
            AddReportRow(ds, "入力", "必要SMG", $"{RequiredSMG:F1} kn", sortOrder: 2);
            AddReportRow(ds, "入力", "流向", $"{SetDir:F1}°", sortOrder: 3);
            AddReportRow(ds, "入力", "流速", $"{DriftSpeed:F1} kn", sortOrder: 4);
            AddReportRow(ds, "結果", "視針路", $"{ShipCourse:F1}°", true, 5);
            AddReportRow(ds, "結果", "対水速力", $"{ShipSpeed:F1} kn", true, 6);
            return ds;
        }
    }
}
