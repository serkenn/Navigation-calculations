using System.Data;

namespace NavCalc.App.Services
{
    public interface IReportService
    {
        void ExportToPdf(DataSet data, string filePath);
        void ShowPreview(DataSet data);
        void Print(DataSet data);
    }
}
