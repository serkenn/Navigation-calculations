using System.Collections.Generic;
using System.Linq;

namespace NavCalc.Core.Data
{
    public enum CategoryId
    {
        Pilot1,
        Pilot2,
        Astro,
        Sextant,
        TimeArc,
        TimeCalc,
        Exam
    }

    public class CategoryDefinition
    {
        public CategoryId Id { get; set; }
        public string NameJa { get; set; }
        public string NameEn { get; set; }
        public string IconName { get; set; }
    }

    public class CalculatorDefinition
    {
        public string Id { get; set; }
        public CategoryId Category { get; set; }
        public string NameJa { get; set; }
        public string NameEn { get; set; }
        public string IconName { get; set; }
    }

    public static class CalculatorRegistry
    {
        public static readonly List<CategoryDefinition> Categories = new List<CategoryDefinition>
        {
            new CategoryDefinition { Id = CategoryId.Pilot1,   NameJa = "航海計画 PILOT 1",      NameEn = "Voyage Planning",       IconName = "navigation" },
            new CategoryDefinition { Id = CategoryId.Pilot2,   NameJa = "その他の航法 PILOT 2",   NameEn = "Other Navigation",      IconName = "ship" },
            new CategoryDefinition { Id = CategoryId.Astro,    NameJa = "天文航法 ASTRO. NAV",    NameEn = "Celestial Navigation",  IconName = "star" },
            new CategoryDefinition { Id = CategoryId.Sextant,  NameJa = "六分儀 SEXTANT",        NameEn = "Sextant",               IconName = "telescope" },
            new CategoryDefinition { Id = CategoryId.TimeArc,  NameJa = "時間と弧度 TIME & ARC",  NameEn = "Time & Arc",            IconName = "clock" },
            new CategoryDefinition { Id = CategoryId.TimeCalc, NameJa = "四則計算 TIME Calc",     NameEn = "Time Calculations",     IconName = "calculator" },
            new CategoryDefinition { Id = CategoryId.Exam,     NameJa = "海技試験 EXAM",          NameEn = "Maritime Exam",         IconName = "graduation-cap" },
        };

        public static readonly List<CalculatorDefinition> Calculators = new List<CalculatorDefinition>
        {
            // PILOT 1
            new CalculatorDefinition { Id = "course-distance",    Category = CategoryId.Pilot1, NameJa = "針路・航程",      NameEn = "Course & Distance",       IconName = "route" },
            new CalculatorDefinition { Id = "dead-reckoning",     Category = CategoryId.Pilot1, NameJa = "到着点",          NameEn = "Dead Reckoning",          IconName = "map-pin" },
            new CalculatorDefinition { Id = "great-circle",       Category = CategoryId.Pilot1, NameJa = "大圏航法",        NameEn = "Great Circle",            IconName = "globe" },
            new CalculatorDefinition { Id = "composite-sailing",  Category = CategoryId.Pilot1, NameJa = "集成大圏航法",     NameEn = "Composite Sailing",       IconName = "globe" },
            new CalculatorDefinition { Id = "eta",                Category = CategoryId.Pilot1, NameJa = "到着時刻",        NameEn = "ETA",                     IconName = "timer" },

            // PILOT 2
            new CalculatorDefinition { Id = "cmg-smg",            Category = CategoryId.Pilot2, NameJa = "実航針路・速力",   NameEn = "CMG / SMG",               IconName = "move-right" },
            new CalculatorDefinition { Id = "course-to-steer",    Category = CategoryId.Pilot2, NameJa = "視針路・対水速力",  NameEn = "Course to Steer",         IconName = "compass" },
            new CalculatorDefinition { Id = "course-steer-smg",   Category = CategoryId.Pilot2, NameJa = "視針路・実航速力",  NameEn = "Course to Steer & SMG",   IconName = "compass" },
            new CalculatorDefinition { Id = "set-drift",          Category = CategoryId.Pilot2, NameJa = "流向・流速",       NameEn = "Set & Drift",             IconName = "waves" },
            new CalculatorDefinition { Id = "true-wind",          Category = CategoryId.Pilot2, NameJa = "真風向・風速",     NameEn = "True Wind",               IconName = "wind" },
            new CalculatorDefinition { Id = "tide-height",        Category = CategoryId.Pilot2, NameJa = "潮高計算",        NameEn = "Tide Height",             IconName = "arrow-up-down" },
            new CalculatorDefinition { Id = "tidal-stream",       Category = CategoryId.Pilot2, NameJa = "潮流計算",        NameEn = "Tidal Stream",            IconName = "rotate-ccw" },

            // ASTRO
            new CalculatorDefinition { Id = "twilight",           Category = CategoryId.Astro,  NameJa = "薄明時",          NameEn = "Twilight",                IconName = "sunset" },
            new CalculatorDefinition { Id = "star-finder",        Category = CategoryId.Astro,  NameJa = "索星",            NameEn = "Star Finder",             IconName = "star" },
            new CalculatorDefinition { Id = "nautical-almanac",   Category = CategoryId.Astro,  NameJa = "天測暦",          NameEn = "Nautical Almanac",        IconName = "eye" },
            new CalculatorDefinition { Id = "lop",                Category = CategoryId.Astro,  NameJa = "位置の線",        NameEn = "Line of Position",        IconName = "crosshair" },
            new CalculatorDefinition { Id = "position-fix",       Category = CategoryId.Astro,  NameJa = "船位決定",        NameEn = "Position Fix",            IconName = "anchor" },
            new CalculatorDefinition { Id = "gyro-amplitude",     Category = CategoryId.Astro,  NameJa = "出没方位角",      NameEn = "Gyro & Amplitude",        IconName = "compass" },

            // SEXTANT
            new CalculatorDefinition { Id = "altitude-correction", Category = CategoryId.Sextant, NameJa = "測高度改正",    NameEn = "Altitude Correction",     IconName = "telescope" },
            new CalculatorDefinition { Id = "distance-to-object",  Category = CategoryId.Sextant, NameJa = "物標距離",      NameEn = "Distance to Object",      IconName = "eye" },

            // TIME & ARC
            new CalculatorDefinition { Id = "time-to-arc",        Category = CategoryId.TimeArc,  NameJa = "時間→弧度",     NameEn = "Time to Arc",             IconName = "arrow-right-left" },
            new CalculatorDefinition { Id = "arc-to-time",        Category = CategoryId.TimeArc,  NameJa = "弧度→時間",     NameEn = "Arc to Time",             IconName = "arrow-right-left" },

            // TIME Calc
            new CalculatorDefinition { Id = "to-hms",             Category = CategoryId.TimeCalc, NameJa = "時分秒変換",    NameEn = "To HMS",                  IconName = "clock" },
            new CalculatorDefinition { Id = "to-decimal",         Category = CategoryId.TimeCalc, NameJa = "10進数時変換",   NameEn = "To Decimal",              IconName = "calculator" },
            new CalculatorDefinition { Id = "arithmetic",         Category = CategoryId.TimeCalc, NameJa = "四則計算",      NameEn = "Arithmetic",              IconName = "calculator" },

            // EXAM
            new CalculatorDefinition { Id = "meripass-3n",        Category = CategoryId.Exam,   NameJa = "メリパス計算 3N",  NameEn = "Meripass 3N",             IconName = "graduation-cap" },
        };

        public static CalculatorDefinition GetCalculator(string id)
        {
            return Calculators.FirstOrDefault(c => c.Id == id);
        }

        public static CategoryDefinition GetCategory(CategoryId id)
        {
            return Categories.FirstOrDefault(c => c.Id == id);
        }

        public static List<CalculatorDefinition> GetCalculatorsByCategory(CategoryId categoryId)
        {
            return Calculators.Where(c => c.Category == categoryId).ToList();
        }
    }
}
