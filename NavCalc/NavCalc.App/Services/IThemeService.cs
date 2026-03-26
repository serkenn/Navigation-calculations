namespace NavCalc.App.Services
{
    public interface IThemeService
    {
        bool IsDark { get; }
        void ToggleTheme();
        void ApplyTheme(bool isDark);
    }
}
