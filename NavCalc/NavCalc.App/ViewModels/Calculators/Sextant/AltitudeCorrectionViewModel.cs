using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Sextant
{
    public class AltitudeCorrectionViewModel : CalculatorViewModelBase
    {
        private double _hs = 30, _heightOfEye = 15, _temp = 10, _pressure = 1010, _hp, _sd = 16;
        private int _bodyTypeIndex;

        // Results
        private double _dip, _refraction, _parallax, _sdCorr, _totalCorr, _ha, _ho;

        public double Hs { get => _hs; set => SetProperty(ref _hs, value); }
        public double HeightOfEye { get => _heightOfEye; set => SetProperty(ref _heightOfEye, value); }
        public double Temp { get => _temp; set => SetProperty(ref _temp, value); }
        public double Pressure { get => _pressure; set => SetProperty(ref _pressure, value); }
        public double HP { get => _hp; set => SetProperty(ref _hp, value); }
        public double SD { get => _sd; set => SetProperty(ref _sd, value); }
        public int BodyTypeIndex { get => _bodyTypeIndex; set => SetProperty(ref _bodyTypeIndex, value); }

        public double Dip { get => _dip; set => SetProperty(ref _dip, value); }
        public double Refraction { get => _refraction; set => SetProperty(ref _refraction, value); }
        public double Parallax { get => _parallax; set => SetProperty(ref _parallax, value); }
        public double SdCorr { get => _sdCorr; set => SetProperty(ref _sdCorr, value); }
        public double TotalCorr { get => _totalCorr; set => SetProperty(ref _totalCorr, value); }
        public double Ha { get => _ha; set => SetProperty(ref _ha, value); }
        public double Ho { get => _ho; set => SetProperty(ref _ho, value); }

        private static readonly string[] BodyTypeNames = { "太陽下辺", "太陽上辺", "恒星", "月", "惑星" };

        public AltitudeCorrectionViewModel() : base("altitude-correction", "測高度改正", "Altitude Correction") { }

        private BodyType GetBodyType() => (BodyType)BodyTypeIndex;

        protected override void ExecuteCalculation()
        {
            var r = SextantCalc.AltitudeCorrection(Hs, HeightOfEye, GetBodyType(), Temp, Pressure, HP, SD);
            Dip = r.Dip; Refraction = r.Refraction; Parallax = r.Parallax;
            SdCorr = r.SdCorr; TotalCorr = r.TotalCorr; Ha = r.Ha; Ho = r.Ho;
            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Hs = 30; HeightOfEye = 15; Temp = 10; Pressure = 1010; HP = 0; SD = 16;
            BodyTypeIndex = 0;
            Dip = Refraction = Parallax = SdCorr = TotalCorr = Ha = Ho = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "測高度改正", "SEXTANT");
            AddReportRow(ds, "入力", "hs", $"{Hs:F1}°", sortOrder: 1);
            AddReportRow(ds, "入力", "眼高", $"{HeightOfEye:F1} m", sortOrder: 2);
            AddReportRow(ds, "入力", "天体", BodyTypeNames[BodyTypeIndex], sortOrder: 3);
            AddReportRow(ds, "補正", "Dip", $"{-Dip:F1}'", sortOrder: 4);
            AddReportRow(ds, "補正", "ha", $"{NavigationMath.FormatDMS(Ha)}", sortOrder: 5);
            AddReportRow(ds, "補正", "大気差", $"{-Refraction:F1}'", sortOrder: 6);
            AddReportRow(ds, "補正", "視差", $"{Parallax:F1}'", sortOrder: 7);
            AddReportRow(ds, "補正", "半径", $"{SdCorr:F1}'", sortOrder: 8);
            AddReportRow(ds, "結果", "全補正", $"{TotalCorr:F1}'", true, 9);
            AddReportRow(ds, "結果", "Ho", $"{NavigationMath.FormatDMS(Ho)}", true, 10);
            return ds;
        }
    }
}
