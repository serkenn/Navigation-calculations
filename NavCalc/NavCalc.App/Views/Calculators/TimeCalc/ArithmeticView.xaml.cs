using System.Windows.Controls;
using NavCalc.App.ViewModels.Calculators.TimeCalc;

namespace NavCalc.App.Views.Calculators.TimeCalc
{
    public partial class ArithmeticView : UserControl
    {
        public ArithmeticView() { InitializeComponent(); }

        private ArithmeticViewModel VM => DataContext as ArithmeticViewModel;

        private void OpPlus(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.Op = '+'; }
        private void OpMinus(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.Op = '-'; }
        private void OpMul(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.Op = '*'; }
        private void OpDiv(object s, System.Windows.RoutedEventArgs e) { if (VM != null) VM.Op = '/'; }
    }
}
