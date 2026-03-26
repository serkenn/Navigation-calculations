using System;
using System.Collections.Generic;
using System.Windows.Input;
using NavCalc.App.Infrastructure;
using NavCalc.App.ViewModels.Calculators;
using NavCalc.Core.Data;

namespace NavCalc.App.ViewModels
{
    public class MainViewModel : ObservableObject
    {
        private CalculatorViewModelBase _currentCalculator;
        private bool _isDarkTheme;
        private readonly Dictionary<string, CalculatorViewModelBase> _viewModelCache
            = new Dictionary<string, CalculatorViewModelBase>();
        private readonly Dictionary<string, Func<CalculatorViewModelBase>> _viewModelFactories
            = new Dictionary<string, Func<CalculatorViewModelBase>>();

        public SidebarViewModel Sidebar { get; }

        public CalculatorViewModelBase CurrentCalculator
        {
            get => _currentCalculator;
            private set => SetProperty(ref _currentCalculator, value);
        }

        public bool IsDarkTheme
        {
            get => _isDarkTheme;
            set => SetProperty(ref _isDarkTheme, value);
        }

        public ICommand NavigateCommand { get; }
        public ICommand ToggleThemeCommand { get; }

        public MainViewModel()
        {
            Sidebar = new SidebarViewModel();
            NavigateCommand = new RelayCommand<string>(NavigateToCalculator);
            ToggleThemeCommand = new RelayCommand(() => IsDarkTheme = !IsDarkTheme);
        }

        public void RegisterFactory(string calculatorId, Func<CalculatorViewModelBase> factory)
        {
            _viewModelFactories[calculatorId] = factory;
        }

        public void NavigateToCalculator(string calculatorId)
        {
            if (string.IsNullOrEmpty(calculatorId)) return;

            if (!_viewModelCache.TryGetValue(calculatorId, out var vm))
            {
                if (_viewModelFactories.TryGetValue(calculatorId, out var factory))
                {
                    vm = factory();
                    _viewModelCache[calculatorId] = vm;
                }
                else
                {
                    return;
                }
            }

            CurrentCalculator = vm;
            Sidebar.ActiveCalculatorId = calculatorId;
        }
    }

    /// <summary>
    /// パラメータ付きRelayCommand
    /// </summary>
    public class RelayCommand<T> : ICommand
    {
        private readonly Action<T> _execute;
        private readonly Func<T, bool> _canExecute;

        public RelayCommand(Action<T> execute, Func<T, bool> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public event EventHandler CanExecuteChanged
        {
            add => CommandManager.RequerySuggested += value;
            remove => CommandManager.RequerySuggested -= value;
        }

        public bool CanExecute(object parameter) => _canExecute?.Invoke((T)parameter) ?? true;
        public void Execute(object parameter) => _execute((T)parameter);
    }
}
