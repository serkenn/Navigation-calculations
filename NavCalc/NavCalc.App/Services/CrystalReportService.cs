using System;
using System.Data;
using System.IO;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using CrystalDecisions.ReportAppServer.DataSetConversion;
using CrystalDecisions.ReportAppServer.ReportDefModel;
using CrystalDecisions.ReportAppServer.DataDefModel;
using NavCalc.App.Views;

namespace NavCalc.App.Services
{
    /// <summary>
    /// Crystal Reports サービス。
    /// .rpt ファイルが未設定の場合は DataSetConverter + RAS API でレイアウトを自動構成して保存する。
    /// </summary>
    public class CrystalReportService : IReportService
    {
        private static readonly string ReportDir =
            Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Reports");
        private static readonly string ReportPath =
            Path.Combine(ReportDir, "NavCalcReport.rpt");
        private static readonly string ConfiguredMarker =
            Path.Combine(ReportDir, "NavCalcReport.configured");

        // 一度だけ構成するためのフラグ
        private static bool _isConfigured;
        private static readonly object _configLock = new object();

        public void ShowPreview(DataSet data)
        {
            var report = LoadReport(data);   // ownership → window
            var window = new ReportPreviewWindow(report);
            window.ShowDialog();
        }

        public void Print(DataSet data)
        {
            using (var report = LoadReport(data))
            {
                report.PrintToPrinter(1, false, 0, 0);
            }
        }

        public void ExportToPdf(DataSet data, string filePath)
        {
            using (var report = LoadReport(data))
            {
                report.ExportToDisk(ExportFormatType.PortableDocFormat, filePath);
            }
        }

        // ---------------------------------------------------------------
        // 内部実装
        // ---------------------------------------------------------------

        private ReportDocument LoadReport(DataSet data)
        {
            EnsureConfigured(data);

            var report = new ReportDocument();
            report.Load(ReportPath);
            report.SetDataSource(data);
            return report;
        }

        private void EnsureConfigured(DataSet templateData)
        {
            if (_isConfigured || File.Exists(ConfiguredMarker)) { _isConfigured = true; return; }

            lock (_configLock)
            {
                if (_isConfigured || File.Exists(ConfiguredMarker)) { _isConfigured = true; return; }

                if (!File.Exists(ReportPath))
                    throw new FileNotFoundException($"NavCalcReport.rpt が見つかりません:\n{ReportPath}");

                try
                {
                    BuildReportLayout(templateData);
                    File.WriteAllText(ConfiguredMarker, DateTime.Now.ToString());
                    _isConfigured = true;
                }
                catch (Exception ex)
                {
                    throw new InvalidOperationException(
                        "レポートレイアウトの自動構成に失敗しました:\n" + ex.Message, ex);
                }
            }
        }

        /// <summary>
        /// RAS API を使ってブランク .rpt にデータソースとフィールドを設定し上書き保存する。
        /// </summary>
        private static void BuildReportLayout(DataSet templateData)
        {
            var report = new ReportDocument();
            report.Load(ReportPath);

            try
            {
                var clientDoc = report.ReportClientDocument;

                // ── 1. DataSet をデータソースとして登録 ──────────────────
                DataSetConverter.AddDataSet(clientDoc, templateData,
                    string.Empty, string.Empty);

                // ── 2. テーブルとフィールドを取得 ────────────────────────
                var tables = clientDoc.DataDefController.DataDefinition.Tables;

                ISCRTable headerTable = null, rowsTable = null;
                for (int i = 0; i < tables.Count; i++)
                {
                    var t = (ISCRTable)tables[i];
                    if (t.Alias == "ReportHeader") headerTable = t;
                    else if (t.Alias == "ReportRows") rowsTable = t;
                }

                if (headerTable == null || rowsTable == null)
                    throw new InvalidOperationException("DataSet のテーブルが見つかりません。");

                // ── 3. セクション高さ設定 ─────────────────────────────────
                // Sections: [0]=ReportHeader [1]=PageHeader [2]=Detail [3]=PageFooter [4]=ReportFooter
                var sections = clientDoc.ReportDefController.ReportDefinition.Sections;
                SetSectionHeight(clientDoc, sections[0], 1400);   // ReportHeader
                SetSectionHeight(clientDoc, sections[2], 320);    // Detail

                // ── 4. ReportHeader にフィールドを追加 ──────────────────
                // CalculatorName (大きめ)
                AddField(clientDoc, 0,
                    FieldFormula(headerTable, "CalculatorName"),
                    left: 200, top: 80, width: 9000, height: 520);

                // Category
                AddField(clientDoc, 0,
                    FieldFormula(headerTable, "Category"),
                    left: 200, top: 680, width: 3000, height: 300);

                // DateTime
                AddField(clientDoc, 0,
                    FieldFormula(headerTable, "DateTime"),
                    left: 3400, top: 680, width: 4000, height: 300);

                // ── 5. Detail セクションにフィールドを追加 ───────────────
                // SectionName
                AddField(clientDoc, 2,
                    FieldFormula(rowsTable, "SectionName"),
                    left: 200, top: 30, width: 2200, height: 280);

                // Label
                AddField(clientDoc, 2,
                    FieldFormula(rowsTable, "Label"),
                    left: 2600, top: 30, width: 3200, height: 280);

                // Value
                AddField(clientDoc, 2,
                    FieldFormula(rowsTable, "Value"),
                    left: 6000, top: 30, width: 3500, height: 280);

                // ── 6. 上書き保存 ────────────────────────────────────────
                report.SaveAs(ReportPath, true);
            }
            finally
            {
                report.Dispose();
            }
        }

        private static string FieldFormula(ISCRTable table, string fieldName)
        {
            for (int i = 0; i < table.DataFields.Count; i++)
            {
                var f = (ISCRField)table.DataFields[i];
                if (string.Equals(f.Name, fieldName, StringComparison.OrdinalIgnoreCase))
                    return f.FormulaForm;
            }
            return $"{{{table.Alias}.{fieldName}}}";
        }

        private static void SetSectionHeight(ISCRReportClientDocument clientDoc,
            ISCRSection section, int heightTwips)
        {
            var fmt = new SectionFormat();
            fmt.Height = heightTwips;
            clientDoc.ReportDefController.ModifySectionFormat(section, fmt);
        }

        private static void AddField(ISCRReportClientDocument clientDoc,
            int sectionIndex, string formulaForm,
            int left, int top, int width, int height)
        {
            var fo = new FieldObject();
            fo.DataSourceName = formulaForm;
            fo.Left   = left;
            fo.Top    = top;
            fo.Width  = width;
            fo.Height = height;

            clientDoc.ReportDefController.AddObject(fo, sectionIndex, fo);
        }
    }
}
