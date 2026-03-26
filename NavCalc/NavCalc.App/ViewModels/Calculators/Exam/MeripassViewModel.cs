using System;
using System.Data;
using NavCalc.Core.Calculations;

namespace NavCalc.App.ViewModels.Calculators.Exam
{
    public class MeripassViewModel : CalculatorViewModelBase
    {
        // Standard Meridian
        private double _standardMeridian;
        private int _meridianDirIndex; // 0=E, 1=W

        // Morning sight - DR Position
        private double _drLatDeg, _drLatMin;
        private int _drLatDirIndex;
        private double _drLonDeg, _drLonMin;
        private int _drLonDirIndex;

        // Morning sight - Observation
        private double _hsDeg, _hsMin;
        private double _totalCorr;
        private double _ghaDeg, _ghaMin;
        private double _decDeg, _decMin;
        private int _decDirIndex;

        // Run
        private double _course, _distance;

        // Noon observation
        private double _noonDecDeg, _noonDecMin;
        private int _noonDecDirIndex;
        private double _eqTimeMin, _eqTimeSec;
        private int _eqTimeSign; // 0= +, 1= -
        private double _noonHsDeg, _noonHsMin;
        private double _noonCorr;

        // Intermediate results
        private double _morningHo, _morningHc, _morningLha, _morningIntercept, _morningAzimuth;
        private double _runDLat, _runDep, _runDLong, _runLat2;
        private double _noonHo, _noonLat, _zenithDist;

        // Final results
        private double _fixLat, _fixLon;
        private string _fixLatFormatted = "", _fixLonFormatted = "";
        private string _lmtFormatted = "", _gmtFormatted = "", _ztFormatted = "";

        #region Properties - Standard Meridian
        public double StandardMeridian { get => _standardMeridian; set => SetProperty(ref _standardMeridian, value); }
        public int MeridianDirIndex { get => _meridianDirIndex; set => SetProperty(ref _meridianDirIndex, value); }
        #endregion

        #region Properties - Morning DR
        public double DrLatDeg { get => _drLatDeg; set => SetProperty(ref _drLatDeg, value); }
        public double DrLatMin { get => _drLatMin; set => SetProperty(ref _drLatMin, value); }
        public int DrLatDirIndex { get => _drLatDirIndex; set => SetProperty(ref _drLatDirIndex, value); }
        public double DrLonDeg { get => _drLonDeg; set => SetProperty(ref _drLonDeg, value); }
        public double DrLonMin { get => _drLonMin; set => SetProperty(ref _drLonMin, value); }
        public int DrLonDirIndex { get => _drLonDirIndex; set => SetProperty(ref _drLonDirIndex, value); }
        #endregion

        #region Properties - Morning Observation
        public double HsDeg { get => _hsDeg; set => SetProperty(ref _hsDeg, value); }
        public double HsMin { get => _hsMin; set => SetProperty(ref _hsMin, value); }
        public double TotalCorr { get => _totalCorr; set => SetProperty(ref _totalCorr, value); }
        public double GhaDeg { get => _ghaDeg; set => SetProperty(ref _ghaDeg, value); }
        public double GhaMin { get => _ghaMin; set => SetProperty(ref _ghaMin, value); }
        public double DecDeg { get => _decDeg; set => SetProperty(ref _decDeg, value); }
        public double DecMin { get => _decMin; set => SetProperty(ref _decMin, value); }
        public int DecDirIndex { get => _decDirIndex; set => SetProperty(ref _decDirIndex, value); }
        #endregion

        #region Properties - Run
        public double Course { get => _course; set => SetProperty(ref _course, value); }
        public double Distance { get => _distance; set => SetProperty(ref _distance, value); }
        #endregion

        #region Properties - Noon Observation
        public double NoonDecDeg { get => _noonDecDeg; set => SetProperty(ref _noonDecDeg, value); }
        public double NoonDecMin { get => _noonDecMin; set => SetProperty(ref _noonDecMin, value); }
        public int NoonDecDirIndex { get => _noonDecDirIndex; set => SetProperty(ref _noonDecDirIndex, value); }
        public double EqTimeMin { get => _eqTimeMin; set => SetProperty(ref _eqTimeMin, value); }
        public double EqTimeSec { get => _eqTimeSec; set => SetProperty(ref _eqTimeSec, value); }
        public int EqTimeSign { get => _eqTimeSign; set => SetProperty(ref _eqTimeSign, value); }
        public double NoonHsDeg { get => _noonHsDeg; set => SetProperty(ref _noonHsDeg, value); }
        public double NoonHsMin { get => _noonHsMin; set => SetProperty(ref _noonHsMin, value); }
        public double NoonCorr { get => _noonCorr; set => SetProperty(ref _noonCorr, value); }
        #endregion

        #region Properties - Results
        public double MorningHo { get => _morningHo; set => SetProperty(ref _morningHo, value); }
        public double MorningHc { get => _morningHc; set => SetProperty(ref _morningHc, value); }
        public double MorningLha { get => _morningLha; set => SetProperty(ref _morningLha, value); }
        public double MorningIntercept { get => _morningIntercept; set => SetProperty(ref _morningIntercept, value); }
        public double MorningAzimuth { get => _morningAzimuth; set => SetProperty(ref _morningAzimuth, value); }
        public double RunDLat { get => _runDLat; set => SetProperty(ref _runDLat, value); }
        public double RunDep { get => _runDep; set => SetProperty(ref _runDep, value); }
        public double RunDLong { get => _runDLong; set => SetProperty(ref _runDLong, value); }
        public double RunLat2 { get => _runLat2; set => SetProperty(ref _runLat2, value); }
        public double NoonHo { get => _noonHo; set => SetProperty(ref _noonHo, value); }
        public double NoonLat { get => _noonLat; set => SetProperty(ref _noonLat, value); }
        public double ZenithDist { get => _zenithDist; set => SetProperty(ref _zenithDist, value); }
        public double FixLat { get => _fixLat; set => SetProperty(ref _fixLat, value); }
        public double FixLon { get => _fixLon; set => SetProperty(ref _fixLon, value); }
        public string FixLatFormatted { get => _fixLatFormatted; set => SetProperty(ref _fixLatFormatted, value); }
        public string FixLonFormatted { get => _fixLonFormatted; set => SetProperty(ref _fixLonFormatted, value); }
        public string LmtFormatted { get => _lmtFormatted; set => SetProperty(ref _lmtFormatted, value); }
        public string GmtFormatted { get => _gmtFormatted; set => SetProperty(ref _gmtFormatted, value); }
        public string ZtFormatted { get => _ztFormatted; set => SetProperty(ref _ztFormatted, value); }
        #endregion

        public MeripassViewModel() : base("meripass", "正中時計算", "Meridian Passage") { }

        private double ToDec(double deg, double min, int dirIndex)
        {
            return (deg + min / 60.0) * (dirIndex == 0 ? 1 : -1);
        }

        private string FormatTime(double hours)
        {
            while (hours < 0) hours += 24.0;
            while (hours >= 24) hours -= 24.0;
            int h = (int)Math.Floor(hours);
            int m = (int)Math.Floor((hours - h) * 60.0);
            int s = (int)Math.Round(((hours - h) * 60.0 - m) * 60.0);
            if (s == 60) { s = 0; m++; }
            if (m == 60) { m = 0; h++; }
            return $"{h:D2}:{m:D2}:{s:D2}";
        }

        protected override void ExecuteCalculation()
        {
            // --- Morning Sight ---
            double drLat = ToDec(DrLatDeg, DrLatMin, DrLatDirIndex);
            double drLon = ToDec(DrLonDeg, DrLonMin, DrLonDirIndex);
            double hs = HsDeg + HsMin / 60.0;
            double ho = hs + TotalCorr / 60.0;
            double gha = GhaDeg + GhaMin / 60.0;
            double dec = ToDec(DecDeg, DecMin, DecDirIndex);

            double lha = gha - drLon;
            while (lha < 0) lha += 360.0;
            while (lha >= 360) lha -= 360.0;

            var (hc, z) = NavigationMath.CalculateSightReduction(drLat, dec, lha);
            double intercept = (ho - hc) * 60.0;

            MorningHo = ho;
            MorningHc = hc;
            MorningLha = lha;
            MorningIntercept = intercept;
            MorningAzimuth = z;

            // --- Run ---
            var run = NavigationMath.CalculateRun(drLat, Course, Distance);
            RunDLat = run.DLat;
            RunDep = run.Dep;
            RunDLong = run.DLong;
            RunLat2 = run.Lat2;

            // --- Noon Latitude from Meridian Altitude ---
            double noonDec = ToDec(NoonDecDeg, NoonDecMin, NoonDecDirIndex);
            double noonHs = NoonHsDeg + NoonHsMin / 60.0;
            double noonHo = noonHs + NoonCorr / 60.0;
            double zenDist = 90.0 - noonHo;

            // Determine noon latitude: same name -> add, different name -> subtract
            double noonLat;
            bool sameHemisphere = (drLat >= 0 && noonDec >= 0) || (drLat < 0 && noonDec < 0);
            if (sameHemisphere)
                noonLat = noonDec + zenDist;
            else
                noonLat = noonDec - zenDist;

            NoonHo = noonHo;
            ZenithDist = zenDist;
            NoonLat = noonLat;

            // --- Meripass Correction ---
            double dLatMiles = RunDLat * 60.0;
            var meripass = NavigationMath.CalculateMeripass(intercept, z, dLatMiles, noonLat);

            // --- Fix Position ---
            FixLat = noonLat;

            double drLon2 = drLon + RunDLong;
            double fixLon = drLon2 + meripass.DLongCorr / 60.0;
            FixLon = fixLon;

            FixLatFormatted = NavigationMath.FormatDMS(FixLat, "lat");
            FixLonFormatted = NavigationMath.FormatDMS(FixLon, "lon");

            // --- Meridian Passage Time ---
            double eqTimeTotal = EqTimeMin + EqTimeSec / 60.0;
            if (EqTimeSign == 1) eqTimeTotal = -eqTimeTotal;

            double lmt = 12.0 - eqTimeTotal / 60.0;
            double gmt = lmt - fixLon / 15.0;

            double stdMeridian = StandardMeridian * (MeridianDirIndex == 0 ? 1 : -1);
            double zt = gmt + stdMeridian / 15.0;

            LmtFormatted = FormatTime(lmt);
            GmtFormatted = FormatTime(gmt);
            ZtFormatted = FormatTime(zt);

            HasResult = true;
        }

        protected override void ClearInputs()
        {
            StandardMeridian = 0;
            MeridianDirIndex = 0;
            DrLatDeg = DrLatMin = DrLonDeg = DrLonMin = 0;
            DrLatDirIndex = DrLonDirIndex = 0;
            HsDeg = HsMin = TotalCorr = 0;
            GhaDeg = GhaMin = DecDeg = DecMin = 0;
            DecDirIndex = 0;
            Course = Distance = 0;
            NoonDecDeg = NoonDecMin = 0;
            NoonDecDirIndex = 0;
            EqTimeMin = EqTimeSec = 0;
            EqTimeSign = 0;
            NoonHsDeg = NoonHsMin = NoonCorr = 0;
            MorningHo = MorningHc = MorningLha = MorningIntercept = MorningAzimuth = 0;
            RunDLat = RunDep = RunDLong = RunLat2 = 0;
            NoonHo = NoonLat = ZenithDist = 0;
            FixLat = FixLon = 0;
            FixLatFormatted = FixLonFormatted = "";
            LmtFormatted = GmtFormatted = ZtFormatted = "";
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "正中時計算", "EXAM");
            int order = 1;

            // Inputs - Standard Meridian
            AddReportRow(ds, "入力", "標準子午線",
                $"{StandardMeridian:F0}° {(MeridianDirIndex == 0 ? "E" : "W")}", sortOrder: order++);

            // Inputs - Morning DR
            AddReportRow(ds, "入力", "DR緯度",
                $"{DrLatDeg:F0}° {DrLatMin:F1}' {(DrLatDirIndex == 0 ? "N" : "S")}", sortOrder: order++);
            AddReportRow(ds, "入力", "DR経度",
                $"{DrLonDeg:F0}° {DrLonMin:F1}' {(DrLonDirIndex == 0 ? "E" : "W")}", sortOrder: order++);

            // Inputs - Morning observation
            AddReportRow(ds, "入力", "Hs", $"{HsDeg:F0}° {HsMin:F1}'", sortOrder: order++);
            AddReportRow(ds, "入力", "改正量", $"{TotalCorr:F1}'", sortOrder: order++);
            AddReportRow(ds, "入力", "GHA", $"{GhaDeg:F0}° {GhaMin:F1}'", sortOrder: order++);
            AddReportRow(ds, "入力", "Dec", $"{DecDeg:F0}° {DecMin:F1}' {(DecDirIndex == 0 ? "N" : "S")}", sortOrder: order++);

            // Inputs - Run
            AddReportRow(ds, "入力", "針路", $"{Course:F1}°", sortOrder: order++);
            AddReportRow(ds, "入力", "航程", $"{Distance:F1} NM", sortOrder: order++);

            // Inputs - Noon
            AddReportRow(ds, "入力", "正午Dec",
                $"{NoonDecDeg:F0}° {NoonDecMin:F1}' {(NoonDecDirIndex == 0 ? "N" : "S")}", sortOrder: order++);
            string eqSign = EqTimeSign == 0 ? "+" : "-";
            AddReportRow(ds, "入力", "均時差", $"{eqSign}{EqTimeMin:F0}m {EqTimeSec:F0}s", sortOrder: order++);
            AddReportRow(ds, "入力", "正午Hs", $"{NoonHsDeg:F0}° {NoonHsMin:F1}'", sortOrder: order++);
            AddReportRow(ds, "入力", "正午改正", $"{NoonCorr:F1}'", sortOrder: order++);

            // Intermediate - Morning sight
            AddReportRow(ds, "中間計算", "Morning Ho", NavigationMath.FormatDMS(MorningHo), false, order++);
            AddReportRow(ds, "中間計算", "Morning LHA", NavigationMath.FormatDMS(MorningLha), false, order++);
            AddReportRow(ds, "中間計算", "Morning Hc", NavigationMath.FormatDMS(MorningHc), false, order++);
            string intDir = MorningIntercept >= 0 ? "T" : "A";
            AddReportRow(ds, "中間計算", "修正差",
                $"{Math.Abs(MorningIntercept):F1}' {intDir}", false, order++);
            AddReportRow(ds, "中間計算", "方位", $"{MorningAzimuth:F1}°", false, order++);

            // Intermediate - Run
            AddReportRow(ds, "中間計算", "緯度差(Run)", $"{RunDLat:F4}°", false, order++);
            AddReportRow(ds, "中間計算", "Dep(Run)", $"{RunDep:F1} NM", false, order++);
            AddReportRow(ds, "中間計算", "経度差(Run)", $"{RunDLong:F4}°", false, order++);

            // Intermediate - Noon
            AddReportRow(ds, "中間計算", "Noon Ho", NavigationMath.FormatDMS(NoonHo), false, order++);
            AddReportRow(ds, "中間計算", "天頂距離", $"{ZenithDist:F2}°", false, order++);
            AddReportRow(ds, "中間計算", "正午緯度", NavigationMath.FormatDMS(NoonLat, "lat"), false, order++);

            // Final results
            AddReportRow(ds, "結果", "船位緯度", FixLatFormatted, true, order++);
            AddReportRow(ds, "結果", "船位経度", FixLonFormatted, true, order++);
            AddReportRow(ds, "結果", "LMT", LmtFormatted, true, order++);
            AddReportRow(ds, "結果", "GMT", GmtFormatted, true, order++);
            AddReportRow(ds, "結果", "ZT", ZtFormatted, true, order++);

            return ds;
        }
    }
}
