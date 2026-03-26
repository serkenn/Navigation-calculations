using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot1
{
    public class GreatCircleViewModel : CalculatorViewModelBase
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
        private double _distance, _course, _latVertex;

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

        public double Distance { get => _distance; set => SetProperty(ref _distance, value); }
        public double Course { get => _course; set => SetProperty(ref _course, value); }
        public double LatVertex { get => _latVertex; set => SetProperty(ref _latVertex, value); }

        public GreatCircleViewModel() : base("great-circle", "大圏航法", "Great Circle") { }

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

            var r = GreatCircle.GreatCircleSailing(lat1, lon1, lat2, lon2);
            Distance = r.Distance;
            Course = r.Course;
            LatVertex = r.LatVertex;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Lat1Deg = Lat1Min = Lon1Deg = Lon1Min = 0;
            Lat2Deg = Lat2Min = Lon2Deg = Lon2Min = 0;
            Lat1DirIndex = Lon1DirIndex = Lat2DirIndex = Lon2DirIndex = 0;
            Distance = Course = LatVertex = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "大圏航法", "PILOT 1");
            AddReportRow(ds, "入力", "出発緯度", $"{Lat1Deg:F0}° {Lat1Min:F1}' {(Lat1DirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "出発経度", $"{Lon1Deg:F0}° {Lon1Min:F1}' {(Lon1DirIndex == 0 ? "E" : "W")}", sortOrder: 2);
            AddReportRow(ds, "入力", "到着緯度", $"{Lat2Deg:F0}° {Lat2Min:F1}' {(Lat2DirIndex == 0 ? "N" : "S")}", sortOrder: 3);
            AddReportRow(ds, "入力", "到着経度", $"{Lon2Deg:F0}° {Lon2Min:F1}' {(Lon2DirIndex == 0 ? "E" : "W")}", sortOrder: 4);
            AddReportRow(ds, "結果", "大圏距離", $"{Distance:F1} NM", true, 5);
            AddReportRow(ds, "結果", "初針路", $"{Course:F1}°", true, 6);
            AddReportRow(ds, "結果", "頂点緯度", $"{LatVertex:F1}°", true, 7);
            return ds;
        }
    }
}
