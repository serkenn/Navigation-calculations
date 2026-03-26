using System;
using System.Collections.ObjectModel;
using System.Data;
using NavCalc.Core.Calculations;
using NavCalc.Core.Data;

namespace NavCalc.App.ViewModels.Calculators.Astro
{
    public class StarFinderViewModel : CalculatorViewModelBase
    {
        private double _latDeg, _latMin;
        private int _latDirIndex;
        private double _ghaAries;
        private double _minAlt = 15;
        private double _maxAlt = 75;

        private ObservableCollection<StarResult> _results = new ObservableCollection<StarResult>();

        public double LatDeg { get => _latDeg; set => SetProperty(ref _latDeg, value); }
        public double LatMin { get => _latMin; set => SetProperty(ref _latMin, value); }
        public int LatDirIndex { get => _latDirIndex; set => SetProperty(ref _latDirIndex, value); }
        public double GhaAries { get => _ghaAries; set => SetProperty(ref _ghaAries, value); }
        public double MinAlt { get => _minAlt; set => SetProperty(ref _minAlt, value); }
        public double MaxAlt { get => _maxAlt; set => SetProperty(ref _maxAlt, value); }

        public ObservableCollection<StarResult> Results { get => _results; set => SetProperty(ref _results, value); }

        public StarFinderViewModel() : base("star-finder", "索星表", "Star Finder") { }

        private double ToDec(double deg, double min, int dirIndex)
        {
            return (deg + min / 60.0) * (dirIndex == 0 ? 1 : -1);
        }

        protected override void ExecuteCalculation()
        {
            double lat = ToDec(LatDeg, LatMin, LatDirIndex);
            var found = new ObservableCollection<StarResult>();

            foreach (var star in NavigationStars.Stars)
            {
                double lha = (GhaAries + star.Sha) % 360.0;
                if (lha < 0) lha += 360.0;

                var (alt, az) = Astronomy.StarAltAz(lat, star.Dec, lha);

                if (alt >= MinAlt && alt <= MaxAlt)
                {
                    found.Add(new StarResult
                    {
                        Name = star.Name,
                        Sha = star.Sha,
                        Dec = star.Dec,
                        Alt = Math.Round(alt, 1),
                        Az = Math.Round(az, 1)
                    });
                }
            }

            Results = found;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            LatDeg = LatMin = 0;
            LatDirIndex = 0;
            GhaAries = 0;
            MinAlt = 15;
            MaxAlt = 75;
            Results = new ObservableCollection<StarResult>();
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "索星表", "ASTRO");
            AddReportRow(ds, "入力", "緯度", $"{LatDeg:F0}° {LatMin:F1}' {(LatDirIndex == 0 ? "N" : "S")}", sortOrder: 1);
            AddReportRow(ds, "入力", "GHA Aries", $"{GhaAries:F1}°", sortOrder: 2);
            AddReportRow(ds, "入力", "最低高度", $"{MinAlt:F1}°", sortOrder: 3);
            AddReportRow(ds, "入力", "最高高度", $"{MaxAlt:F1}°", sortOrder: 4);

            int order = 5;
            foreach (var s in Results)
            {
                AddReportRow(ds, "結果", s.Name,
                    $"SHA {s.Sha:F1}° Dec {s.Dec:F1}° Alt {s.Alt:F1}° Az {s.Az:F1}°",
                    true, order++);
            }

            return ds;
        }

        public class StarResult
        {
            public string Name { get; set; } = "";
            public double Sha { get; set; }
            public double Dec { get; set; }
            public double Alt { get; set; }
            public double Az { get; set; }
        }
    }
}
