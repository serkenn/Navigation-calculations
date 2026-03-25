/**
 * 航海用主要恒星カタログ (SHA, Dec)
 * SHA: Sidereal Hour Angle (度)
 * Dec: 赤緯 (度)
 * Epoch 2025.0 approximate
 */
export interface StarData {
  name: string;
  sha: number;
  dec: number;
}

export const navigationStars: StarData[] = [
  { name: 'Alpheratz', sha: 358.0, dec: 29.1 },
  { name: 'Ankaa', sha: 353.3, dec: -42.3 },
  { name: 'Schedar', sha: 349.5, dec: 56.5 },
  { name: 'Diphda', sha: 349.0, dec: -17.9 },
  { name: 'Achernar', sha: 335.4, dec: -57.2 },
  { name: 'Hamal', sha: 328.1, dec: 23.5 },
  { name: 'Polaris', sha: 319.6, dec: 89.3 },
  { name: 'Acamar', sha: 315.2, dec: -40.3 },
  { name: 'Menkar', sha: 314.2, dec: 4.1 },
  { name: 'Mirfak', sha: 308.7, dec: 49.9 },
  { name: 'Aldebaran', sha: 290.9, dec: 16.5 },
  { name: 'Rigel', sha: 281.2, dec: -8.2 },
  { name: 'Capella', sha: 280.4, dec: 46.0 },
  { name: 'Bellatrix', sha: 278.5, dec: 6.4 },
  { name: 'Elnath', sha: 278.2, dec: 28.6 },
  { name: 'Alnilam', sha: 275.7, dec: -1.2 },
  { name: 'Betelgeuse', sha: 271.0, dec: 7.4 },
  { name: 'Canopus', sha: 264.0, dec: -52.7 },
  { name: 'Sirius', sha: 258.3, dec: -16.7 },
  { name: 'Adhara', sha: 255.2, dec: -29.0 },
  { name: 'Procyon', sha: 245.0, dec: 5.2 },
  { name: 'Pollux', sha: 243.4, dec: 28.0 },
  { name: 'Avior', sha: 234.2, dec: -59.5 },
  { name: 'Suhail', sha: 222.9, dec: -43.4 },
  { name: 'Miaplacidus', sha: 221.7, dec: -69.7 },
  { name: 'Alphard', sha: 218.0, dec: -8.7 },
  { name: 'Regulus', sha: 207.8, dec: 11.9 },
  { name: 'Dubhe', sha: 193.6, dec: 61.7 },
  { name: 'Denebola', sha: 182.5, dec: 14.6 },
  { name: 'Gienah', sha: 176.0, dec: -17.5 },
  { name: 'Acrux', sha: 173.2, dec: -63.1 },
  { name: 'Gacrux', sha: 172.1, dec: -57.1 },
  { name: 'Alioth', sha: 166.3, dec: 55.9 },
  { name: 'Spica', sha: 158.4, dec: -11.2 },
  { name: 'Alkaid', sha: 152.9, dec: 49.3 },
  { name: 'Hadar', sha: 148.9, dec: -60.4 },
  { name: 'Menkent', sha: 148.1, dec: -36.4 },
  { name: 'Arcturus', sha: 146.0, dec: 19.1 },
  { name: 'Rigil Kent', sha: 139.9, dec: -60.8 },
  { name: 'Zubenelgenubi', sha: 137.1, dec: -16.0 },
  { name: 'Kochab', sha: 137.2, dec: 74.1 },
  { name: 'Alphecca', sha: 126.1, dec: 26.7 },
  { name: 'Antares', sha: 112.3, dec: -26.4 },
  { name: 'Atria', sha: 107.4, dec: -69.0 },
  { name: 'Sabik', sha: 102.2, dec: -15.7 },
  { name: 'Shaula', sha: 96.4, dec: -37.1 },
  { name: 'Rasalhague', sha: 96.1, dec: 12.6 },
  { name: 'Eltanin', sha: 90.5, dec: 51.5 },
  { name: 'Kaus Australis', sha: 83.8, dec: -34.4 },
  { name: 'Vega', sha: 80.6, dec: 38.8 },
  { name: 'Nunki', sha: 76.0, dec: -26.3 },
  { name: 'Altair', sha: 62.1, dec: 8.9 },
  { name: 'Peacock', sha: 53.3, dec: -56.7 },
  { name: 'Deneb', sha: 49.3, dec: 45.3 },
  { name: 'Enif', sha: 33.8, dec: 9.9 },
  { name: 'Alnair', sha: 27.9, dec: -46.9 },
  { name: 'Fomalhaut', sha: 15.4, dec: -29.6 },
  { name: 'Markab', sha: 13.4, dec: 15.2 },
];
