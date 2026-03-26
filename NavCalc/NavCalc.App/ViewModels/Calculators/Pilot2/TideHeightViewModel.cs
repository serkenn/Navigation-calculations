using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Pilot2
{
    public class TideHeightViewModel : CalculatorViewModelBase
    {
        private double _hwHeight, _lwHeight, _hwTime, _lwTime, _targetTime;
        private double _height, _range, _duration, _elapsed, _ratio;

        public double HwHeight { get => _hwHeight; set => SetProperty(ref _hwHeight, value); }
        public double LwHeight { get => _lwHeight; set => SetProperty(ref _lwHeight, value); }
        public double HwTime { get => _hwTime; set => SetProperty(ref _hwTime, value); }
        public double LwTime { get => _lwTime; set => SetProperty(ref _lwTime, value); }
        public double TargetTime { get => _targetTime; set => SetProperty(ref _targetTime, value); }
        public double Height { get => _height; set => SetProperty(ref _height, value); }
        public double Range { get => _range; set => SetProperty(ref _range, value); }
        public double Duration { get => _duration; set => SetProperty(ref _duration, value); }
        public double Elapsed { get => _elapsed; set => SetProperty(ref _elapsed, value); }
        public double Ratio { get => _ratio; set => SetProperty(ref _ratio, value); }

        public TideHeightViewModel() : base("tide-height", "潮高計算", "Tide Height") { }

        protected override void ExecuteCalculation()
        {
            var r = Tide.TideHeight(HwHeight, LwHeight, HwTime, LwTime, TargetTime);
            Height = r.Height; Range = r.Range; Duration = r.Duration;
            Elapsed = r.Elapsed; Ratio = r.Ratio;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            HwHeight = LwHeight = HwTime = LwTime = TargetTime = 0;
            Height = Range = Duration = Elapsed = Ratio = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "潮高計算", "PILOT 2");
            AddReportRow(ds, "入力", "高潮位", $"{HwHeight:F2} m", sortOrder: 1);
            AddReportRow(ds, "入力", "低潮位", $"{LwHeight:F2} m", sortOrder: 2);
            AddReportRow(ds, "入力", "高潮時", $"{HwTime:F2} h", sortOrder: 3);
            AddReportRow(ds, "入力", "低潮時", $"{LwTime:F2} h", sortOrder: 4);
            AddReportRow(ds, "入力", "目標時刻", $"{TargetTime:F2} h", sortOrder: 5);
            AddReportRow(ds, "結果", "潮高", $"{Height:F2} m", true, 6);
            AddReportRow(ds, "結果", "潮差", $"{Range:F2} m", true, 7);
            AddReportRow(ds, "結果", "潮汐継続時間", $"{Duration:F2} h", true, 8);
            AddReportRow(ds, "結果", "経過時間", $"{Elapsed:F2} h", true, 9);
            AddReportRow(ds, "結果", "比率", $"{Ratio:F4}", true, 10);
            return ds;
        }
    }
}
