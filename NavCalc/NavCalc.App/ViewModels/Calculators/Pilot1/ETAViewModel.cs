using System;
using System.Data;

namespace NavCalc.App.ViewModels.Calculators.Pilot1
{
    public class ETAViewModel : CalculatorViewModelBase
    {
        // Inputs
        private double _distance, _speed;
        private int _departureH, _departureM;

        // Results
        private int _travelTimeH, _travelTimeM, _etaH, _etaM, _extraDays;
        private double _travelTimeDecimal;

        public double Distance { get => _distance; set => SetProperty(ref _distance, value); }
        public double Speed { get => _speed; set => SetProperty(ref _speed, value); }
        public int DepartureH { get => _departureH; set => SetProperty(ref _departureH, value); }
        public int DepartureM { get => _departureM; set => SetProperty(ref _departureM, value); }

        public int TravelTimeH { get => _travelTimeH; set => SetProperty(ref _travelTimeH, value); }
        public int TravelTimeM { get => _travelTimeM; set => SetProperty(ref _travelTimeM, value); }
        public double TravelTimeDecimal { get => _travelTimeDecimal; set => SetProperty(ref _travelTimeDecimal, value); }
        public int EtaH { get => _etaH; set => SetProperty(ref _etaH, value); }
        public int EtaM { get => _etaM; set => SetProperty(ref _etaM, value); }
        public int ExtraDays { get => _extraDays; set => SetProperty(ref _extraDays, value); }

        public ETAViewModel() : base("eta", "到着時刻", "ETA") { }

        protected override void ExecuteCalculation()
        {
            if (Speed <= 0) return;

            double travelHours = Distance / Speed;
            TravelTimeDecimal = travelHours;
            TravelTimeH = (int)Math.Floor(travelHours);
            TravelTimeM = (int)Math.Round((travelHours - TravelTimeH) * 60.0);

            int totalMinutes = DepartureH * 60 + DepartureM + TravelTimeH * 60 + TravelTimeM;
            ExtraDays = totalMinutes / (24 * 60);
            int remaining = totalMinutes % (24 * 60);
            if (remaining < 0)
            {
                remaining += 24 * 60;
                ExtraDays--;
            }
            EtaH = remaining / 60;
            EtaM = remaining % 60;

            HasResult = true;
        }

        protected override void ClearInputs()
        {
            Distance = Speed = 0;
            DepartureH = DepartureM = 0;
            TravelTimeH = TravelTimeM = EtaH = EtaM = ExtraDays = 0;
            TravelTimeDecimal = 0;
        }

        public override DataSet GetReportData()
        {
            var ds = CreateReportDataSet();
            AddReportHeader(ds, "到着時刻", "PILOT 1");
            AddReportRow(ds, "入力", "航程", $"{Distance:F1} NM", sortOrder: 1);
            AddReportRow(ds, "入力", "速力", $"{Speed:F1} kn", sortOrder: 2);
            AddReportRow(ds, "入力", "出発時刻", $"{DepartureH:D2}:{DepartureM:D2}", sortOrder: 3);
            AddReportRow(ds, "結果", "航海時間", $"{TravelTimeH}h {TravelTimeM:D2}m ({TravelTimeDecimal:F2}h)", true, 4);
            AddReportRow(ds, "結果", "到着時刻", $"{EtaH:D2}:{EtaM:D2}", true, 5);
            if (ExtraDays > 0)
                AddReportRow(ds, "結果", "追加日数", $"+{ExtraDays} 日", true, 6);
            return ds;
        }
    }
}
