using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot1
{
    public class DeadReckoningViewModel : CalculatorViewModelBase
    {
        // Departure position
        private double _lat1Deg, _lat1Min;
        private int _lat1DirIndex;
        private double _lon1Deg, _lon1Min;
        private int _lon1DirIndex;

        // Course and distance
        private double _course, _distance;

        // Results
        private string _lat2Formatted = "", _lon2Formatted = "";
        private double _lat2, _lon2, _dLat, _dLon, _dep;

        public double Lat1Deg { get => _lat1Deg; set => SetProperty(ref _lat1Deg, value); }
        public double Lat1Min { get => _lat1Min; set => SetProperty(ref _lat1Min, value); }
        public int Lat1DirIndex { get => _lat1DirIndex; set => SetProperty(ref _lat1DirIndex, value); }
        public double Lon1Deg { get => _lon1Deg; set => SetProperty(ref _lon1Deg, value); }
        public double Lon1Min { get => _lon1Min; set => SetProperty(ref _lon1Min, value); }
        public int Lon1DirIndex { get => _lon1DirIndex; set => SetProperty(ref _lon1DirIndex, value); }

        public double Course { get => _course; set => SetProperty(ref _course, value); }
        public double Distance { get => _distance; set => SetProperty(ref _distance, value); }

        public double Lat2 { get => _lat2; set => SetProperty(ref _lat2, value); }
        public double Lon2 { get => _lon2; set => SetProperty(ref _lon2, value); }
        public string Lat2Formatted { get => _lat2Formatted; set => SetProperty(ref _lat2Formatted, value); }
        public string Lon2Formatted { get => _lon2Formatted; set => SetProperty(ref _lon2Formatted, value); }
        public double DLat { get => _dLat; set => SetProperty(ref _dLat, value); }
        public double DLon { get => _dLon; set => SetProperty(ref _dLon, value); }
        public double Dep { get => _dep; set => SetProperty(ref _dep, value); }

        public DeadReckoningViewModel() : base("dead-reckoning", "到着点", "Dead Reckoning") { }

        private double ToDec(double deg, double min, int dirIndex)
        {
            return (deg + min / 60.0) * (dirIndex == 0 ? 1 : -1);
        }

        protected override void ExecuteCalculation()
        {
            double lat1 = ToDec(Lat1Deg, Lat1Min, Lat1DirIndex);
            double lon1 = ToDec(Lon1Deg, Lon1Min, Lon1DirIndex);

            var r = MercatorSailing.DeadReckoning(lat1, lon1, Course, Distance);
            Lat2 = r.Lat2;
            Lon2 = r.Lon2;
            DLat = r.DLat;
            DLon = r.DLon;
            Dep = r.Dep;
            Lat2Formatted = NavigationMath.FormatDMS(r.Lat2);
            Lon2Formatted = NavigationMath.FormatDMS(r.Lon2);
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Lat1Deg = Lat1Min = Lon1Deg = Lon1Min = 0;
            Lat1DirIndex = Lon1DirIndex = 0;
            Course = Distance = 0;
            Lat2 = Lon2 = DLat = DLon = Dep = 0;
            Lat2Formatted = Lon2Formatted = "";
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "到着点", "PILOT 1");
            AddReportRow(ds, "入力", "出発緯度", $"{Lat1Deg:F0}° {Lat1Min:F1}' {(Lat1DirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "出発経度", $"{Lon1Deg:F0}° {Lon1Min:F1}' {(Lon1DirIndex == 0 ? "E" : "W")}", sortOrder: 2);
            AddReportRow(ds, "入力", "針路", $"{Course:F1}°", sortOrder: 3);
            AddReportRow(ds, "入力", "航程", $"{Distance:F1} NM", sortOrder: 4);
            AddReportRow(ds, "結果", "到着緯度", Lat2Formatted, true, 5);
            AddReportRow(ds, "結果", "到着経度", Lon2Formatted, true, 6);
            AddReportRow(ds, "結果", "緯度差", $"{DLat:F2}°", false, 7);
            AddReportRow(ds, "結果", "経度差", $"{DLon:F2}°", false, 8);
            AddReportRow(ds, "結果", "Dep", $"{Dep:F1} NM", false, 9);
            return ds;
        }
    }
}
