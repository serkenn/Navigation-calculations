using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot1
{
    public class CompositeSailingViewModel : CalculatorViewModelBase
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

        // Limiting latitude
        private double _limitLat;

        // Results
        private double _totalDistance, _initialCourse, _gcDist1, _gcDist2, _parallelDist, _lonV1, _lonV2;
        private bool _isComposite;

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

        public double LimitLat { get => _limitLat; set => SetProperty(ref _limitLat, value); }

        public double TotalDistance { get => _totalDistance; set => SetProperty(ref _totalDistance, value); }
        public double InitialCourse { get => _initialCourse; set => SetProperty(ref _initialCourse, value); }
        public double GcDist1 { get => _gcDist1; set => SetProperty(ref _gcDist1, value); }
        public double GcDist2 { get => _gcDist2; set => SetProperty(ref _gcDist2, value); }
        public double ParallelDist { get => _parallelDist; set => SetProperty(ref _parallelDist, value); }
        public double LonV1 { get => _lonV1; set => SetProperty(ref _lonV1, value); }
        public double LonV2 { get => _lonV2; set => SetProperty(ref _lonV2, value); }
        public bool IsComposite { get => _isComposite; set => SetProperty(ref _isComposite, value); }

        public CompositeSailingViewModel() : base("composite-sailing", "集成大圏航法", "Composite Sailing") { }

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

            var r = GreatCircle.CompositeSailing(lat1, lon1, lat2, lon2, LimitLat);
            TotalDistance = r.TotalDistance;
            InitialCourse = r.InitialCourse;
            GcDist1 = r.GcDist1;
            GcDist2 = r.GcDist2;
            ParallelDist = r.ParallelDist;
            LonV1 = r.LonV1;
            LonV2 = r.LonV2;
            IsComposite = r.IsComposite;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Lat1Deg = Lat1Min = Lon1Deg = Lon1Min = 0;
            Lat2Deg = Lat2Min = Lon2Deg = Lon2Min = 0;
            Lat1DirIndex = Lon1DirIndex = Lat2DirIndex = Lon2DirIndex = 0;
            LimitLat = 0;
            TotalDistance = InitialCourse = GcDist1 = GcDist2 = ParallelDist = LonV1 = LonV2 = 0;
            IsComposite = false;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "集成大圏航法", "PILOT 1");
            AddReportRow(ds, "入力", "出発緯度", $"{Lat1Deg:F0}° {Lat1Min:F1}' {(Lat1DirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "出発経度", $"{Lon1Deg:F0}° {Lon1Min:F1}' {(Lon1DirIndex == 0 ? "E" : "W")}", sortOrder: 2);
            AddReportRow(ds, "入力", "到着緯度", $"{Lat2Deg:F0}° {Lat2Min:F1}' {(Lat2DirIndex == 0 ? "N" : "S")}", sortOrder: 3);
            AddReportRow(ds, "入力", "到着経度", $"{Lon2Deg:F0}° {Lon2Min:F1}' {(Lon2DirIndex == 0 ? "E" : "W")}", sortOrder: 4);
            AddReportRow(ds, "入力", "制限緯度", $"{LimitLat:F1}°", sortOrder: 5);
            AddReportRow(ds, "結果", "総航程", $"{TotalDistance:F1} NM", true, 6);
            AddReportRow(ds, "結果", "初針路", $"{InitialCourse:F1}°", true, 7);
            AddReportRow(ds, "結果", "大圏区間1", $"{GcDist1:F1} NM", false, 8);
            AddReportRow(ds, "結果", "大圏区間2", $"{GcDist2:F1} NM", false, 9);
            AddReportRow(ds, "結果", "平行圏区間", $"{ParallelDist:F1} NM", false, 10);
            AddReportRow(ds, "結果", "変針経度1", $"{LonV1:F1}°", false, 11);
            AddReportRow(ds, "結果", "変針経度2", $"{LonV2:F1}°", false, 12);
            AddReportRow(ds, "結果", "集成航法適用", IsComposite ? "はい" : "いいえ (大圏のみ)", true, 13);
            return ds;
        }
    }
}
