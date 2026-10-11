export default function ActionButtons({ onCopy, onDownload, onDownloadHtml, onDownloadPdf, isDocPack, onClear }) {
  return (
    <section className="action-buttons">
      <div className="action-buttons-group">
        <button type="button" className="btn btn-secondary" onClick={onCopy} title="Copy current markdown to clipboard">
          📋 Copy to Clipboard
        </button>
        <button type="button" className="btn btn-secondary" onClick={onDownload} title="Download file(s)">
          ⬇️ {isDocPack ? 'Download Doc Pack (.zip)' : 'Download Markdown (.md)'}
        </button>
        {onDownloadHtml && (
          <button type="button" className="btn btn-secondary" onClick={onDownloadHtml} title="Export as standalone HTML">
            🌐 Export HTML
          </button>
        )}
        {onDownloadPdf && (
          <button type="button" className="btn btn-secondary" onClick={onDownloadPdf} title="Export as PDF document">
            📄 Export PDF
          </button>
        )}
      </div>

      {onClear && (
        <button type="button" className="btn-clear-draft" onClick={onClear} title="Clear generated content">
          ✕ Reset
        </button>
      )}
    </section>
  )
}
