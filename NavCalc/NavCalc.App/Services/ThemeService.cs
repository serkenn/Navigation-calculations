using System;
using System.Windows;

namespace NavCalc.App.Services
{
    public class ThemeService : IThemeService
    {
        private const string LightThemePath = "Themes/LightTheme.xaml";
        private const string DarkThemePath = "Themes/DarkTheme.xaml";

        public bool IsDark { get; private set; }

        public void ToggleTheme()
        {
            ApplyTheme(!IsDark);
        }

        public void ApplyTheme(bool isDark)
        {
            IsDark = isDark;
            var app = Application.Current;
            var mergedDicts = app.Resources.MergedDictionaries;

            // テーマ辞書を探して差し替え
            ResourceDictionary themeToRemove = null;
            foreach (var dict in mergedDicts)
            {
                var source = dict.Source?.OriginalString ?? "";
                if (source.Contains("LightTheme") || source.Contains("DarkTheme"))
                {
                    themeToRemove = dict;
                    break;
                }
            }

            if (themeToRemove != null)
                mergedDicts.Remove(themeToRemove);

            var newTheme = new ResourceDictionary
            {
                Source = new Uri(isDark ? DarkThemePath : LightThemePath, UriKind.Relative)
            };
            mergedDicts.Insert(0, newTheme);
        }
    }
}
