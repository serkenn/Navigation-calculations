using System.Windows;
using System.Windows.Controls;

namespace NavCalc.App.Controls
{
    public partial class DMSInputControl : UserControl
    {
        public static readonly DependencyProperty LabelProperty =
            DependencyProperty.Register("Label", typeof(string), typeof(DMSInputControl), new PropertyMetadata(""));

        public static readonly DependencyProperty DegreesProperty =
            DependencyProperty.Register("Degrees", typeof(int), typeof(DMSInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty MinutesProperty =
            DependencyProperty.Register("Minutes", typeof(double), typeof(DMSInputControl),
                new FrameworkPropertyMetadata(0.0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty DirectionIndexProperty =
            DependencyProperty.Register("DirectionIndex", typeof(int), typeof(DMSInputControl),
                new FrameworkPropertyMetadata(0, FrameworkPropertyMetadataOptions.BindsTwoWayByDefault));

        public static readonly DependencyProperty ShowDirectionProperty =
            DependencyProperty.Register("ShowDirection", typeof(bool), typeof(DMSInputControl), new PropertyMetadata(true));

        public static readonly DependencyProperty SignTypeProperty =
            DependencyProperty.Register("SignType", typeof(string), typeof(DMSInputControl),
                new PropertyMetadata("NS", OnSignTypeChanged));

        public string Label
        {
            get => (string)GetValue(LabelProperty);
            set => SetValue(LabelProperty, value);
        }

        public int Degrees
        {
            get => (int)GetValue(DegreesProperty);
            set => SetValue(DegreesProperty, value);
        }

        public double Minutes
        {
            get => (double)GetValue(MinutesProperty);
            set => SetValue(MinutesProperty, value);
        }

        public int DirectionIndex
        {
            get => (int)GetValue(DirectionIndexProperty);
            set => SetValue(DirectionIndexProperty, value);
        }

        public bool ShowDirection
        {
            get => (bool)GetValue(ShowDirectionProperty);
            set => SetValue(ShowDirectionProperty, value);
        }

        public string SignType
        {
            get => (string)GetValue(SignTypeProperty);
            set => SetValue(SignTypeProperty, value);
        }

        public DMSInputControl()
        {
            InitializeComponent();
            UpdateDirectionItems();
        }

        private static void OnSignTypeChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            ((DMSInputControl)d).UpdateDirectionItems();
        }

        private void UpdateDirectionItems()
        {
            DirectionBox.Items.Clear();
            if (SignType == "NS")
            {
                DirectionBox.Items.Add("N");
                DirectionBox.Items.Add("S");
            }
            else if (SignType == "EW")
            {
                DirectionBox.Items.Add("E");
                DirectionBox.Items.Add("W");
            }
            else
            {
                DirectionBox.Items.Add("+");
                DirectionBox.Items.Add("-");
            }

            if (DirectionBox.SelectedIndex < 0)
                DirectionBox.SelectedIndex = 0;
        }

        /// <summary>
        /// Direction: 0 = N/E/+  (sign=1),  1 = S/W/-  (sign=-1)
        /// </summary>
        public int GetSign() => DirectionIndex == 0 ? 1 : -1;
    }
}
