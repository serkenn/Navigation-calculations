using System.Windows.Controls;
using NavCalc.App.ViewModels.Calculators.Sextant;

namespace NavCalc.App.Views.Calculators.Sextant
{
    public partial class AltitudeCorrectionView : UserControl
    {
        public AltitudeCorrectionView() { InitializeComponent(); }
        private AltitudeCorrectionViewModel VM => DataContext as AltitudeCorrectionViewModel;
        private void Body0(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.BodyTypeIndex = 0; }
        private void Body1(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.BodyTypeIndex = 1; }
        private void Body2(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.BodyTypeIndex = 2; }
        private void Body3(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.BodyTypeIndex = 3; }
        private void Body4(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.BodyTypeIndex = 4; }
    }
}
