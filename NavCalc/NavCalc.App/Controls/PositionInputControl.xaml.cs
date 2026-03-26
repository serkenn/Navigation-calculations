using System.Windows;
using System.Windows.Controls;

namespace NavCalc.App.Controls
{
    public partial class PositionInputControl : UserControl
    {
        public static readonly DependencyProperty LatLabelProperty =
            DependencyProperty.Register("LatLabel", typeof(string), typeof(PositionInputControl), new PropertyMetadata("緯度 (Lat)"));
        public static readonly DependencyProperty LonLabelProperty =
            DependencyProperty.Register("LonLabel", typeof(string), typeof(PositionInputControl), new PropertyMetadata("経度 (Lon)"));

        public static readonly DependencyProperty LatDegreesProperty =
            DependencyProperty.Register("LatDegrees", typeof(int), typeof(PositionInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));
        public static readonly DependencyProperty LatMinutesProperty =
            DependencyProperty.Register("LatMinutes", typeof(double), typeof(PositionInputControl),
                new FrameworkPropertyMetadata(0.0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));
        public static readonly DependencyProperty LatDirectionIndexProperty =
            DependencyProperty.Register("LatDirectionIndex", typeof(int), typeof(PositionInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty LonDegreesProperty =
            DependencyProperty.Register("LonDegrees", typeof(int), typeof(PositionInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));
        public static readonly DependencyProperty LonMinutesProperty =
            DependencyProperty.Register("LonMinutes", typeof(double), typeof(PositionInputControl),
                new FrameworkPropertyMetadata(0.0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));
        public static readonly DependencyProperty LonDirectionIndexProperty =
            DependencyProperty.Register("LonDirectionIndex", typeof(int), typeof(PositionInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public string LatLabel { get => (string)GetValue(LatLabelProperty); set => SetValue(LatLabelProperty, value); }
        public string LonLabel { get => (string)GetValue(LonLabelProperty); set => SetValue(LonLabelProperty, value); }
        public int LatDegrees { get => (int)GetValue(LatDegreesProperty); set => SetValue(LatDegreesProperty, value); }
        public double LatMinutes { get => (double)GetValue(LatMinutesProperty); set => SetValue(LatMinutesProperty, value); }
        public int LatDirectionIndex { get => (int)GetValue(LatDirectionIndexProperty); set => SetValue(LatDirectionIndexProperty, value); }
        public int LonDegrees { get => (int)GetValue(LonDegreesProperty); set => SetValue(LonDegreesProperty, value); }
        public double LonMinutes { get => (double)GetValue(LonMinutesProperty); set => SetValue(LonMinutesProperty, value); }
        public int LonDirectionIndex { get => (int)GetValue(LonDirectionIndexProperty); set => SetValue(LonDirectionIndexProperty, value); }

        public PositionInputControl()
        {
            InitializeComponent();
        }

        public double GetLatDecimal()
        {
            int sign = LatDirectionIndex == 0 ? 1 : -1;
            return (LatDegrees + LatMinutes / 60.0) * sign;
        }

        public double GetLonDecimal()
        {
            int sign = LonDirectionIndex == 0 ? 1 : -1;
            return (LonDegrees + LonMinutes / 60.0) * sign;
        }
    }
}
