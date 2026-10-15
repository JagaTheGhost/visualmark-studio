import React from 'react'

export default function PreviewBreadcrumbs({ activeFile, activeHeading, previewPreset }) {
  return (
    <div className="editor-breadcrumbs-bar select-none">
      <span className="breadcrumb-segment" title="Workspace Root">
        <span className="material-symbols-outlined breadcrumb-icon">folder_open</span>
        <span>workspace</span>
      </span>
      <span className="breadcrumb-separator">›</span>
      <span className="breadcrumb-segment" title={`Active file: ${activeFile}`}>
        <span className="material-symbols-outlined breadcrumb-icon">description</span>
        <span>{activeFile}</span>
      </span>
      {activeHeading && (
        <>
          <span className="breadcrumb-separator">›</span>
          <span
            className="breadcrumb-segment breadcrumb-heading"
            title={`Active Section: ${activeHeading}`}
          >
            <span className="material-symbols-outlined breadcrumb-icon text-primary">tag</span>
            <span>{activeHeading}</span>
          </span>
        </>
      )}
      {previewPreset && (
        <>
          <span className="breadcrumb-separator">›</span>
          <span
            className="breadcrumb-segment breadcrumb-preset-active"
            title={`Currently previewing preset: ${previewPreset.title}`}
          >
            <span className="material-symbols-outlined breadcrumb-icon text-amber">visibility</span>
            <span>[Previewing Preset] {previewPreset.title}</span>
          </span>
        </>
      )}
    </div>
  )
}
