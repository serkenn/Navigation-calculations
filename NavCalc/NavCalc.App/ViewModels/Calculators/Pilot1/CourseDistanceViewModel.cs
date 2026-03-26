using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot1
{
    public class CourseDistanceViewModel : CalculatorViewModelBase
    {
        // Departure position
        private double _lat1Deg, _lat1Min;
        private int _lat1DirIndex;
        private double _lon1Deg, _lon1Min;
        private int _lon1DirIndex;

        // Arrival position
        private double _lat2Deg, _lat2Min;
        private int _lat2DirIndex;
        private double _lon2Deg, _lon2Min;
        private int _lon2DirIndex;

        // Results
        private double _course, _distance, _dLat, _dLon, _dmp;

        public double Lat1Deg { get => _lat1Deg; set => SetProperty(ref _lat1Deg, value); }
        public double Lat1Min { get => _lat1Min; set => SetProperty(ref _lat1Min, value); }
        public int Lat1DirIndex { get => _lat1DirIndex; set => SetProperty(ref _lat1DirIndex, value); }
        public double Lon1Deg { get => _lon1Deg; set => SetProperty(ref _lon1Deg, value); }
        public double Lon1Min { get => _lon1Min; set => SetProperty(ref _lon1Min, value); }
        public int Lon1DirIndex { get => _lon1DirIndex; set => SetProperty(ref _lon1DirIndex, value); }

        public double Lat2Deg { get => _lat2Deg; set => SetProperty(ref _lat2Deg, value); }
        public double Lat2Min { get => _lat2Min; set => SetProperty(ref _lat2Min, value); }
        public int Lat2DirIndex { get => _lat2DirIndex; set => SetProperty(ref _lat2DirIndex, value); }
        public double Lon2Deg { get => _lon2Deg; set => SetProperty(ref _lon2Deg, value); }
        public double Lon2Min { get => _lon2Min; set => SetProperty(ref _lon2Min, value); }
        public int Lon2DirIndex { get => _lon2DirIndex; set => SetProperty(ref _lon2DirIndex, value); }

        public double Course { get => _course; set => SetProperty(ref _course, value); }
        public double Distance { get => _distance; set => SetProperty(ref _distance, value); }
        public double DLat { get => _dLat; set => SetProperty(ref _dLat, value); }
        public double DLon { get => _dLon; set => SetProperty(ref _dLon, value); }
        public double DMP { get => _dmp; set => SetProperty(ref _dmp, value); }

        public CourseDistanceViewModel() : base("course-distance", "針路・航程", "Course & Distance") { }

        private double ToDec(double deg, double min, int dirIndex)
        {
            return (deg + min / 60.0) * (dirIndex == 0 ? 1 : -1);
        }

        protected override void ExecuteCalculation()
        {
            double lat1 = ToDec(Lat1Deg, Lat1Min, Lat1DirIndex);
            double lon1 = ToDec(Lon1Deg, Lon1Min, Lon1DirIndex);
            double lat2 = ToDec(Lat2Deg, Lat2Min, Lat2DirIndex);
            double lon2 = ToDec(Lon2Deg, Lon2Min, Lon2DirIndex);

            var r = MercatorSailing.CourseDistance(lat1, lon1, lat2, lon2);
            Course = r.Course;
            Distance = r.Distance;
            DLat = r.DLat;
            DLon = r.DLon;
            DMP = r.DMP;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Lat1Deg = Lat1Min = Lon1Deg = Lon1Min = 0;
            Lat2Deg = Lat2Min = Lon2Deg = Lon2Min = 0;
            Lat1DirIndex = Lon1DirIndex = Lat2DirIndex = Lon2DirIndex = 0;
            Course = Distance = DLat = DLon = DMP = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "針路・航程", "PILOT 1");
            AddReportRow(ds, "入力", "出発緯度", $"{Lat1Deg:F0}° {Lat1Min:F1}' {(Lat1DirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "出発経度", $"{Lon1Deg:F0}° {Lon1Min:F1}' {(Lon1DirIndex == 0 ? "E" : "W")}", sortOrder: 2);
            AddReportRow(ds, "入力", "到着緯度", $"{Lat2Deg:F0}° {Lat2Min:F1}' {(Lat2DirIndex == 0 ? "N" : "S")}", sortOrder: 3);
            AddReportRow(ds, "入力", "到着経度", $"{Lon2Deg:F0}° {Lon2Min:F1}' {(Lon2DirIndex == 0 ? "E" : "W")}", sortOrder: 4);
            AddReportRow(ds, "結果", "針路", $"{Course:F1}°", true, 5);
            AddReportRow(ds, "結果", "航程", $"{Distance:F1} NM", true, 6);
            AddReportRow(ds, "結果", "緯度差", $"{DLat:F1}'", false, 7);
            AddReportRow(ds, "結果", "経度差", $"{DLon:F1}'", false, 8);
            AddReportRow(ds, "結果", "経線弧長差", $"{DMP:F1}'", false, 9);
            return ds;
        }
    }
}
