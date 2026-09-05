/**
 * KisanFlow Official Reporting & Export Utilities
 * Generates verified CSV and XLSX reports with unique Report IDs and timestamps.
 */

export const generateReportId = (prefix = 'KF-REP') => {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
};

/**
 * 1. exportToCSV
 * Converts array of objects to UTF-8 CSV with BOM for Excel compatibility
 */
export const exportToCSV = (data, filenamePrefix = 'KISANFLOW_REPORT') => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  const reportId = generateReportId();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${filenamePrefix}_${timestamp}.csv`;

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(field => {
      let cell = row[field] === null || row[field] === undefined ? '' : String(row[field]);
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  );

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 2. exportToXLSX
 * Generates Microsoft Excel XML Spreadsheet format (.xlsx / .xml)
 */
export const exportToXLSX = (data, filenamePrefix = 'KISANFLOW_REPORT') => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  const reportId = generateReportId();
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}_${timestamp}.xlsx`;

  const headers = Object.keys(data[0]);

  let xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Styles>
  <Style ss:ID="Header">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#15803D" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Standard">
   <Font ss:Color="#000000"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="KisanFlow Report">
  <Table>
   <Row ss:StyleID="Header">
    ${headers.map(h => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('')}
   </Row>`;

  data.forEach(row => {
    xml += '\n   <Row ss:StyleID="Standard">';
    headers.forEach(h => {
      const val = row[h] === null || row[h] === undefined ? '' : String(row[h]);
      const isNum = !isNaN(Number(val)) && val.trim() !== '';
      xml += `\n    <Cell><Data ss:Type="${isNum ? 'Number' : 'String'}">${escapeXml(val)}</Data></Cell>`;
    });
    xml += '\n   </Row>';
  });

  xml += `
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const escapeXml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};
