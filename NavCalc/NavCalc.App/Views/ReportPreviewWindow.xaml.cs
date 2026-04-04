using System;
using System.Windows;
using System.Windows.Forms.Integration;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Windows.Forms;

namespace NavCalc.App.Views
{
    public partial class ReportPreviewWindow : Window
    {
        private readonly ReportDocument _report;
        private CrystalReportViewer _viewer;

        public ReportPreviewWindow(ReportDocument report)
        {
            InitializeComponent();
            _report = report;
            Loaded += OnLoaded;
            Closed += OnClosed;
        }

        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            _viewer = new CrystalReportViewer
            {
                ReportSource = _report,
                Dock = System.Windows.Forms.DockStyle.Fill,
                ShowPrintButton = true,
                ShowExportButton = true,
                ShowRefreshButton = false,
                ShowGroupTreeButton = false,
                ShowCloseButton = false
            };

            var host = new WindowsFormsHost { Child = _viewer };
            ContentGrid.Children.Add(host);
        }

        private void OnClosed(object sender, EventArgs e)
        {
            _viewer?.Dispose();
            _report?.Dispose();
        }
    }
}
