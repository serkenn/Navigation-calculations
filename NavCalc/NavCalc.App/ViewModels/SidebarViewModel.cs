using System.Collections.ObjectModel;
using System.Windows.Input;
using NavCalc.App.Infrastructure;
using NavCalc.Core.Data;

namespace NavCalc.App.ViewModels
{
    public class CategoryViewModel : ObservableObject
    {
        private bool _isExpanded;

        public CategoryDefinition Definition { get; }
        public ObservableCollection<CalculatorDefinition> Calculators { get; }

        public bool IsExpanded
        {
            get => _isExpanded;
            set => SetProperty(ref _isExpanded, value);
        }

        public ICommand ToggleCommand { get; }

        public CategoryViewModel(CategoryDefinition definition)
        {
            Definition = definition;
            Calculators = new ObservableCollection<CalculatorDefinition>(
                CalculatorRegistry.GetCalculatorsByCategory(definition.Id));
            ToggleCommand = new RelayCommand(() => IsExpanded = !IsExpanded);
        }
    }

    public class SidebarViewModel : ObservableObject
    {
        private string _activeCalculatorId;

        public ObservableCollection<CategoryViewModel> Categories { get; }

        public string ActiveCalculatorId
        {
            get => _activeCalculatorId;
            set => SetProperty(ref _activeCalculatorId, value);
        }

        public SidebarViewModel()
        {
            Categories = new ObservableCollection<CategoryViewModel>();
            foreach (var cat in CalculatorRegistry.Categories)
            {
                Categories.Add(new CategoryViewModel(cat));
            }
            // 最初のカテゴリを展開
            if (Categories.Count > 0)
                Categories[0].IsExpanded = true;
        }
    }
}
