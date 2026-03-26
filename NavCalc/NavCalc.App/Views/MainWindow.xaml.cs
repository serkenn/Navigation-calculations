using System.Windows;
using NavCalc.App.Infrastructure;
using NavCalc.App.Services;
using NavCalc.App.ViewModels;

namespace NavCalc.App.Views
{
    public partial class MainWindow : Window
    {
        private readonly MainViewModel _viewModel;
        private readonly ThemeService _themeService;

        public MainWindow()
        {
            InitializeComponent();

            _themeService = new ThemeService();
            _viewModel = new MainViewModel();
            ViewModelLocator.RegisterAll(_viewModel);

            DataContext = _viewModel;
            CategoryList.ItemsSource = _viewModel.Sidebar.Categories;

            _viewModel.PropertyChanged += (s, e) =>
            {
                if (e.PropertyName == nameof(MainViewModel.CurrentCalculator))
                {
                    bool hasCalc = _viewModel.CurrentCalculator != null;
                    WelcomePanel.Visibility = hasCalc ? Visibility.Collapsed : Visibility.Visible;
                    CalculatorPanel.Visibility = hasCalc ? Visibility.Visible : Visibility.Collapsed;
                }
            };
        }

        private void ThemeToggle_Click(object sender, RoutedEventArgs e)
        {
            _themeService.ToggleTheme();
            _viewModel.IsDarkTheme = _themeService.IsDark;
        }
    }
}
