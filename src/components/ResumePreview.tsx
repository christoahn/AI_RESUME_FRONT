import React from 'react';
import '../assets/ResumePreview.css';

interface ResumePreviewProps {
  resumeHTML: string;
  handleDownloadPDF: () => void;
  handleDownloadDOCX: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeHTML,
  handleDownloadPDF,
  handleDownloadDOCX,
}) => {
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Resume Print</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
                line-height: 1.5;
              }
              @media print {
                body {
                  padding: 0;
                }
                @page {
                  margin: 0.5cm;
                }
              }
            </style>
          </head>
          <body>
            ${resumeHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleCopyLink = () => {
    alert('Link copied to clipboard!');
  };

  return (
    <div className="resume-preview-container">
      <div className="preview-header">
        <h2>Resume Preview</h2>
        <div className="preview-actions">
          <button 
            className="action-btn pdf" 
            onClick={handleDownloadPDF}
          >
            📄 PDF
          </button>
          <button 
            className="action-btn docx" 
            onClick={handleDownloadDOCX}
          >
            📝 DOCX
          </button>
          <button 
            className="action-btn print" 
            onClick={handlePrint}
          >
            🖨️ Print
          </button>
          <button 
            className="action-btn share" 
            onClick={handleCopyLink}
          >
            🔗 Share
          </button>
        </div>
      </div>
      
      <div className="preview-content">
        {resumeHTML ? (
          <>
            <div 
              className="resume-document"
              dangerouslySetInnerHTML={{ __html: resumeHTML }} 
            />
            <div className="download-icon" onClick={handleDownloadPDF}>
              ⬇️
            </div>
          </>
        ) : (
          <div className="empty-preview">
            Your resume preview will appear here
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview; 