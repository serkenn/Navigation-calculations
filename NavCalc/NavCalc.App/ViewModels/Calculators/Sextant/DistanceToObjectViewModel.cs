using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Sextant
{
    public class DistanceToObjectViewModel : CalculatorViewModelBase
    {
        private double _angle = 1, _height = 50, _heightOfEye = 15;
        private bool _useGeographicalRange;
        private double _distanceM, _distanceNM;

        public double Angle { get => _angle; set => SetProperty(ref _angle, value); }
        public double Height { get => _height; set => SetProperty(ref _height, value); }
        public double HeightOfEye { get => _heightOfEye; set => SetProperty(ref _heightOfEye, value); }
        public bool UseGeographicalRange { get => _useGeographicalRange; set => SetProperty(ref _useGeographicalRange, value); }
        public double DistanceM { get => _distanceM; set => SetProperty(ref _distanceM, value); }
        public double DistanceNM { get => _distanceNM; set => SetProperty(ref _distanceNM, value); }

        public DistanceToObjectViewModel() : base("distance-to-object", "物標距離", "Distance to Object") { }

        protected override void ExecuteCalculation()
        {
            if (UseGeographicalRange)
            {
                double range = SextantCalc.GeographicalRange(Height, HeightOfEye);
                DistanceNM = range;
                DistanceM = range * 1852;
            }
            else
            {
                var r = SextantCalc.DistanceByVerticalAngle(Angle, Height, HeightOfEye);
                DistanceM = r.DistanceM;
                DistanceNM = r.DistanceNM;
            }
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Angle = 1; Height = 50; HeightOfEye = 15; UseGeographicalRange = false;
            DistanceM = DistanceNM = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "物標距離", "SEXTANT");
            if (!UseGeographicalRange)
                AddReportRow(ds, "入力", "垂直角", $"{Angle:F2}°", sortOrder: 1);
            AddReportRow(ds, "入力", "物標高", $"{Height:F1} m", sortOrder: 2);
            AddReportRow(ds, "入力", "眼高", $"{HeightOfEye:F1} m", sortOrder: 3);
            AddReportRow(ds, "結果", "距離", $"{DistanceNM:F2} NM", true, 4);
            return ds;
        }
    }
}
