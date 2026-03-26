namespace NavCalc.Core.Data
{
    public class StarData
    {
        public string Name { get; }
        public double Sha { get; }
        public double Dec { get; }

        public StarData(string name, double sha, double dec)
        {
            Name = name;
            Sha = sha;
            Dec = dec;
        }
    }

    public static class NavigationStars
    {
        public static readonly StarData[] Stars = new[]
        {
            new StarData("Alpheratz", 358.0, 29.1),
            new StarData("Ankaa", 353.3, -42.3),
            new StarData("Schedar", 349.5, 56.5),
            new StarData("Diphda", 349.0, -17.9),
            new StarData("Achernar", 335.4, -57.2),
            new StarData("Hamal", 328.1, 23.5),
            new StarData("Polaris", 319.6, 89.3),
            new StarData("Acamar", 315.2, -40.3),
            new StarData("Menkar", 314.2, 4.1),
            new StarData("Mirfak", 308.7, 49.9),
            new StarData("Aldebaran", 290.9, 16.5),
            new StarData("Rigel", 281.2, -8.2),
            new StarData("Capella", 280.4, 46.0),
            new StarData("Bellatrix", 278.5, 6.4),
            new StarData("Elnath", 278.2, 28.6),
            new StarData("Alnilam", 275.7, -1.2),
            new StarData("Betelgeuse", 271.0, 7.4),
            new StarData("Canopus", 264.0, -52.7),
            new StarData("Sirius", 258.3, -16.7),
            new StarData("Adhara", 255.2, -29.0),
            new StarData("Procyon", 245.0, 5.2),
            new StarData("Pollux", 243.4, 28.0),
            new StarData("Avior", 234.2, -59.5),
            new StarData("Suhail", 222.9, -43.4),
            new StarData("Miaplacidus", 221.7, -69.7),
            new StarData("Alphard", 218.0, -8.7),
            new StarData("Regulus", 207.8, 11.9),
            new StarData("Dubhe", 193.6, 61.7),
            new StarData("Denebola", 182.5, 14.6),
            new StarData("Gienah", 176.0, -17.5),
            new StarData("Acrux", 173.2, -63.1),
            new StarData("Gacrux", 172.1, -57.1),
            new StarData("Alioth", 166.3, 55.9),
            new StarData("Spica", 158.4, -11.2),
            new StarData("Alkaid", 152.9, 49.3),
            new StarData("Hadar", 148.9, -60.4),
            new StarData("Menkent", 148.1, -36.4),
            new StarData("Arcturus", 146.0, 19.1),
            new StarData("Rigil Kent", 139.9, -60.8),
            new StarData("Zubenelgenubi", 137.1, -16.0),
            new StarData("Kochab", 137.2, 74.1),
            new StarData("Alphecca", 126.1, 26.7),
            new StarData("Antares", 112.3, -26.4),
            new StarData("Atria", 107.4, -69.0),
            new StarData("Sabik", 102.2, -15.7),
            new StarData("Shaula", 96.4, -37.1),
            new StarData("Rasalhague", 96.1, 12.6),
            new StarData("Eltanin", 90.5, 51.5),
            new StarData("Kaus Australis", 83.8, -34.4),
            new StarData("Vega", 80.6, 38.8),
            new StarData("Nunki", 76.0, -26.3),
            new StarData("Altair", 62.1, 8.9),
            new StarData("Peacock", 53.3, -56.7),
            new StarData("Deneb", 49.3, 45.3),
            new StarData("Enif", 33.8, 9.9),
            new StarData("Alnair", 27.9, -46.9),
            new StarData("Fomalhaut", 15.4, -29.6),
            new StarData("Markab", 13.4, 15.2),
        };
    }
}
