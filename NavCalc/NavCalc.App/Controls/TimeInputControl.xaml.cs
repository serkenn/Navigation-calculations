using System.Windows;
using System.Windows.Controls;

namespace NavCalc.App.Controls
{
    public partial class TimeInputControl : UserControl
    {
        public static readonly DependencyProperty LabelProperty =
            DependencyProperty.Register("Label", typeof(string), typeof(TimeInputControl), new PropertyMetadata(""));

        public static readonly DependencyProperty HoursProperty =
            DependencyProperty.Register("Hours", typeof(int), typeof(TimeInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty MinutesProperty =
            DependencyProperty.Register("Minutes", typeof(int), typeof(TimeInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty SecondsProperty =
            DependencyProperty.Register("Seconds", typeof(int), typeof(TimeInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty ShowSecondsProperty =
            DependencyProperty.Register("ShowSeconds", typeof(bool), typeof(TimeInputControl), new PropertyMetadata(true));

        public string Label { get => (string)GetValue(LabelProperty); set => SetValue(LabelProperty, value); }
        public int Hours { get => (int)GetValue(HoursProperty); set => SetValue(HoursProperty, value); }
        public int Minutes { get => (int)GetValue(MinutesProperty); set => SetValue(MinutesProperty, value); }
        public int Seconds { get => (int)GetValue(SecondsProperty); set => SetValue(SecondsProperty, value); }
        public bool ShowSeconds { get => (bool)GetValue(ShowSecondsProperty); set => SetValue(ShowSecondsProperty, value); }

        public TimeInputControl()
        {
            InitializeComponent();
        }
    }
}
