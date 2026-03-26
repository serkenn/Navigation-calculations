using System;
using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Astro
{
    public class GyroAmplitudeViewModel : CalculatorViewModelBase
    {
        private double _latDeg, _latMin;
        private int _latDirIndex;
        private double _decDeg, _decMin;
        private int _decDirIndex;
        private bool _isRise = true;
        private double _gyroAzimuth;

        private double _amplitude, _trueAzimuth, _gyroError;
        private string _amplitudeFormatted = "", _trueAzimuthFormatted = "";
        private string _gyroErrorFormatted = "", _errorDirection = "";

        public double LatDeg { get => _latDeg; set => SetProperty(ref _latDeg, value); }
        public double LatMin { get => _latMin; set => SetProperty(ref _latMin, value); }
        public int LatDirIndex { get => _latDirIndex; set => SetProperty(ref _latDirIndex, value); }
        public double DecDeg { get => _decDeg; set => SetProperty(ref _decDeg, value); }
        public double DecMin { get => _decMin; set => SetProperty(ref _decMin, value); }
        public int DecDirIndex { get => _decDirIndex; set => SetProperty(ref _decDirIndex, value); }
        public bool IsRise { get => _isRise; set => SetProperty(ref _isRise, value); }
        public double GyroAzimuth { get => _gyroAzimuth; set => SetProperty(ref _gyroAzimuth, value); }

        public double Amplitude { get => _amplitude; set => SetProperty(ref _amplitude, value); }
        public double TrueAzimuth { get => _trueAzimuth; set => SetProperty(ref _trueAzimuth, value); }
        public double GyroError { get => _gyroError; set => SetProperty(ref _gyroError, value); }
        public string AmplitudeFormatted { get => _amplitudeFormatted; set => SetProperty(ref _amplitudeFormatted, value); }
        public string TrueAzimuthFormatted { get => _trueAzimuthFormatted; set => SetProperty(ref _trueAzimuthFormatted, value); }
        public string GyroErrorFormatted { get => _gyroErrorFormatted; set => SetProperty(ref _gyroErrorFormatted, value); }
        public string ErrorDirection { get => _errorDirection; set => SetProperty(ref _errorDirection, value); }

        public GyroAmplitudeViewModel() : base("gyro-amplitude", "出没方位角", "Gyro Error by Amplitude") { }

        private double ToDec(double deg, double min, int dirIndex)
        {
            return (deg + min / 60.0) * (dirIndex == 0 ? 1 : -1);
        }

        protected override void ExecuteCalculation()
        {
            double lat = ToDec(LatDeg, LatMin, LatDirIndex);
            double dec = ToDec(DecDeg, DecMin, DecDirIndex);

            double amp = NavigationMath.CalculateAmplitude(lat, dec);

            double trueAz;
            if (IsRise)
                trueAz = dec >= 0 ? 90.0 - amp : 90.0 + amp;
            else
                trueAz = dec >= 0 ? 270.0 + amp : 270.0 - amp;

            double error = NavigationMath.CalculateGyroError(trueAz, GyroAzimuth);

            Amplitude = amp;
            TrueAzimuth = trueAz;
            GyroError = error;

            AmplitudeFormatted = $"{amp:F1}°";
            TrueAzimuthFormatted = $"{trueAz:F1}°";
            GyroErrorFormatted = $"{Math.Abs(error):F1}°";

            if (Math.Abs(error) < 0.05)
                ErrorDirection = "";
            else if (error > 0)
                ErrorDirection = "E (Low)";
            else
                ErrorDirection = "W (High)";

            HasResult = true;
        }

        protected override void ClearInputs()
        {
            LatDeg = LatMin = DecDeg = DecMin = 0;
            LatDirIndex = DecDirIndex = 0;
            IsRise = true;
            GyroAzimuth = 0;
            Amplitude = TrueAzimuth = GyroError = 0;
            AmplitudeFormatted = TrueAzimuthFormatted = GyroErrorFormatted = ErrorDirection = "";
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "出没方位角", "ASTRO");
            AddReportRow(ds, "入力", "緯度", $"{LatDeg:F0}° {LatMin:F1}' {(LatDirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "赤緯", $"{DecDeg:F0}° {DecMin:F1}' {(DecDirIndex == 0 ? "N" : "S")}", sortOrder: 2);
            AddReportRow(ds, "入力", "出没", IsRise ? "出 (Rise)" : "没 (Set)", sortOrder: 3);
            AddReportRow(ds, "入力", "ジャイロ方位", $"{GyroAzimuth:F1}°", sortOrder: 4);
            AddReportRow(ds, "結果", "振幅", AmplitudeFormatted, true, 5);
            AddReportRow(ds, "結果", "真方位", TrueAzimuthFormatted, true, 6);
            AddReportRow(ds, "結果", "ジャイロ誤差", GyroErrorFormatted, true, 7);
            AddReportRow(ds, "結果", "誤差方向", ErrorDirection, true, 8);
            return ds;
        }
    }
}
