using NavCalc.App.ViewModels;
using NavCalc.App.ViewModels.Calculators.Pilot1;
using NavCalc.App.ViewModels.Calculators.Pilot2;
using NavCalc.App.ViewModels.Calculators.Astro;
using NavCalc.App.ViewModels.Calculators.Sextant;
using NavCalc.App.ViewModels.Calculators.TimeArc;
using NavCalc.App.ViewModels.Calculators.TimeCalc;
using NavCalc.App.ViewModels.Calculators.Exam;

namespace NavCalc.App.Infrastructure
{
    public static class ViewModelLocator
    {
        public static void RegisterAll(MainViewModel mainVM)
        {
            // Pilot1
            mainVM.RegisterFactory("course-distance", () => new CourseDistanceViewModel());
            mainVM.RegisterFactory("dead-reckoning", () => new DeadReckoningViewModel());
            mainVM.RegisterFactory("great-circle", () => new GreatCircleViewModel());
            mainVM.RegisterFactory("composite-sailing", () => new CompositeSailingViewModel());
            mainVM.RegisterFactory("eta", () => new ETAViewModel());

            // Pilot2
            mainVM.RegisterFactory("cmg-smg", () => new CMGSMGViewModel());
            mainVM.RegisterFactory("course-to-steer", () => new CourseToSteerViewModel());
            mainVM.RegisterFactory("course-steer-smg", () => new CourseSteerSMGViewModel());
            mainVM.RegisterFactory("set-drift", () => new SetDriftViewModel());
            mainVM.RegisterFactory("true-wind", () => new TrueWindViewModel());
            mainVM.RegisterFactory("tide-height", () => new TideHeightViewModel());
            mainVM.RegisterFactory("tidal-stream", () => new TidalStreamViewModel());

            // Astro
            mainVM.RegisterFactory("twilight", () => new TwilightViewModel());
            mainVM.RegisterFactory("star-finder", () => new StarFinderViewModel());
            mainVM.RegisterFactory("nautical-almanac", () => new NauticalAlmanacViewModel());
            mainVM.RegisterFactory("lop", () => new LOPViewModel());
            mainVM.RegisterFactory("position-fix", () => new PositionFixViewModel());
            mainVM.RegisterFactory("gyro-amplitude", () => new GyroAmplitudeViewModel());

            // Sextant
            mainVM.RegisterFactory("altitude-correction", () => new AltitudeCorrectionViewModel());
            mainVM.RegisterFactory("distance-to-object", () => new DistanceToObjectViewModel());

            // TimeArc
            mainVM.RegisterFactory("time-to-arc", () => new TimeToArcViewModel());
            mainVM.RegisterFactory("arc-to-time", () => new ArcToTimeViewModel());

            // TimeCalc
            mainVM.RegisterFactory("to-hms", () => new ToHMSViewModel());
            mainVM.RegisterFactory("to-decimal", () => new ToDecimalViewModel());
            mainVM.RegisterFactory("arithmetic", () => new ArithmeticViewModel());

            // Exam
            mainVM.RegisterFactory("meripass-3n", () => new MeripassViewModel());
        }
    }
}
