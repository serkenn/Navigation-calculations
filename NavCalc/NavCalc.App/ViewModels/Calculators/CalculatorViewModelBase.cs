using System.Data;
using System.Windows.Input;
using NavCalc.App.Infrastructure;

namespace NavCalc.App.ViewModels.Calculators
{
    public abstract class CalculatorViewModelBase : ObservableObject
    {
        private bool _hasResult;

        public string Title { get; }
        public string Subtitle { get; }
        public string CalculatorId { get; }

        public bool HasResult
        {
            get => _hasResult;
            protected set => SetProperty(ref _hasResult, value);
        }

        public ICommand CalculateCommand { get; }
        public ICommand ClearCommand { get; }

        protected CalculatorViewModelBase(string calculatorId, string title, string subtitle = "")
        {
            CalculatorId = calculatorId;
            Title = title;
            Subtitle = subtitle;
            CalculateCommand = new RelayCommand(ExecuteCalculation, CanCalculate);
            ClearCommand = new RelayCommand(() => { ClearInputs(); HasResult = false; });
        }

        protected abstract void ExecuteCalculation();
        protected abstract void ClearInputs();
        protected virtual bool CanCalculate() => true;

        /// <summary>
        /// Crystal Reports用のデータセットを生成
        /// </summary>
        public abstract DataSet GetReportData();

        /// <summary>
        /// レポート用のデータセットにヘッダとロウを追加するヘルパー
        /// </summary>
        protected DataSet CreateReportDataSet()
        {
            var ds = new DataSet("CalculationReport");

            var header = new DataTable("ReportHeader");
            header.Columns.Add("CalculatorName", typeof(string));
            header.Columns.Add("Category", typeof(string));
            header.Columns.Add("DateTime", typeof(string));

            var rows = new DataTable("ReportRows");
            rows.Columns.Add("SectionName", typeof(string));
            rows.Columns.Add("Label", typeof(string));
            rows.Columns.Add("Value", typeof(string));
            rows.Columns.Add("IsHighlighted", typeof(bool));
            rows.Columns.Add("SortOrder", typeof(int));

            ds.Tables.Add(header);
            ds.Tables.Add(rows);

            return ds;
        }

        protected void AddReportHeader(DataSet ds, string calculatorName, string category)
        {
            var row = ds.Tables["ReportHeader"].NewRow();
            row["CalculatorName"] = calculatorName;
            row["Category"] = category;
            row["DateTime"] = System.DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
            ds.Tables["ReportHeader"].Rows.Add(row);
        }

        protected void AddReportRow(DataSet ds, string section, string label, string value,
            bool isHighlighted = false, int sortOrder = 0)
        {
            var row = ds.Tables["ReportRows"].NewRow();
            row["SectionName"] = section;
            row["Label"] = label;
            row["Value"] = value;
            row["IsHighlighted"] = isHighlighted;
            row["SortOrder"] = sortOrder;
            ds.Tables["ReportRows"].Rows.Add(row);
        }
    }
}
