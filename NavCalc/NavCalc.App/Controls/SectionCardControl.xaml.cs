using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace NavCalc.App.Controls
{
    public partial class SectionCardControl : UserControl
    {
        public static readonly DependencyProperty TitleProperty =
            DependencyProperty.Register("Title", typeof(string), typeof(SectionCardControl), new PropertyMetadata(""));

        public static readonly DependencyProperty AccentBrushProperty =
            DependencyProperty.Register("AccentBrush", typeof(Brush), typeof(SectionCardControl),
                new PropertyMetadata(Brushes.Gray));

        public static readonly DependencyProperty SectionContentProperty =
            DependencyProperty.Register("SectionContent", typeof(object), typeof(SectionCardControl));

        public string Title { get => (string)GetValue(TitleProperty); set => SetValue(TitleProperty, value); }
        public Brush AccentBrush { get => (Brush)GetValue(AccentBrushProperty); set => SetValue(AccentBrushProperty, value); }
        public object SectionContent { get => GetValue(SectionContentProperty); set => SetValue(SectionContentProperty, value); }

        public SectionCardControl()
        {
            InitializeComponent();
        }
    }
}
