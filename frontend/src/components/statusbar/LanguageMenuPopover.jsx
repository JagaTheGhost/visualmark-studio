import React, { useRef, useEffect } from 'react'
import { useI18n } from '../../i18n/I18nContext'
import { useToast } from '../../context/ToastContext'

export default function LanguageMenuPopover({
  isOpen,
  onClose,
  anchorRef,
  onOpenSettings
}) {
  const {
    locale,
    setLocale,
    currentLanguage,
    supportedLanguages,
    importCustomLanguage,
    exportLanguagePack
  } = useI18n()

  const { showToast } = useToast()
  const fileInputRef = useRef(null)
  const popoverRef = useRef(null)

  // Handle outside click to close
  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (e) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose()
      }
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose, anchorRef])

  const handleSelectLanguage = (langCode) => {
    setLocale(langCode)
    showToast({
      title: 'Language Changed',
      message: `VisualMark Studio interface switched to ${supportedLanguages.find(l => l.code === langCode)?.native || langCode}.`,
      type: 'success'
    })
    onClose()
  }

  const handleFileImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result
        const parsed = JSON.parse(text)
        const packCode = importCustomLanguage(parsed)
        showToast({
          title: 'Language Pack Imported',
          message: `Successfully loaded custom language pack: ${packCode}`,
          type: 'success'
        })
        onClose()
      } catch (err) {
        showToast({
          title: 'Import Failed',
          message: err?.message || 'Invalid JSON language dictionary file.',
          type: 'error'
        })
      }
    }
    reader.readAsText(file)
    // reset input so same file can be reloaded if edited
    e.target.value = ''
  }

  const handleExport = () => {
    try {
      exportLanguagePack(locale)
      showToast({
        title: 'Language Pack Exported',
        message: `Saved ${currentLanguage?.label || locale}.json to downloads.`,
        type: 'info'
      })
      onClose()
    } catch (err) {
      showToast({
        title: 'Export Failed',
        message: err.message || 'Could not export language pack.',
        type: 'error'
      })
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={popoverRef}
      className="language-menu-popover"
      style={{
        position: 'absolute',
        bottom: '28px',
        right: '8px',
        width: '280px',
        backgroundColor: 'var(--surface-mid)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 6px rgba(0, 0, 0, 0.25)',
        zIndex: 100,
        overflow: 'hidden',
        animation: 'fadeInUp 0.15s ease-out'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Hidden file input for custom language pack imports */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileImport}
      />

      {/* Popover Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface-low)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>
            translate
          </span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Interface Language
          </span>
        </div>
        <span
          style={{
            fontSize: '10px',
            padding: '1px 5px',
            borderRadius: '4px',
            backgroundColor: 'var(--surface-high)',
            color: 'var(--text-secondary)'
          }}
        >
          {locale.toUpperCase()}
        </span>
      </div>

      {/* Language List */}
      <div
        className="custom-scrollbar"
        style={{
          maxHeight: '260px',
          overflowY: 'auto',
          padding: '4px 0'
        }}
      >
        {supportedLanguages.map((lang) => {
          const isSelected = lang.code === locale
          return (
            <div
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 12px',
                cursor: 'pointer',
                backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                transition: 'background-color 0.12s ease'
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-high)'
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '15px' }}>{lang.flag}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                    {lang.native}
                  </div>
                  {lang.native !== lang.label && (
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      {lang.label}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {lang.code}
                </span>
                {isSelected && (
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--primary)' }}>
                    check
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Popover Actions Footer */}
      <div
        style={{
          padding: '6px 8px',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface-low)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            padding: '5px 8px',
            fontSize: '11px',
            color: 'var(--text-primary)',
            background: 'none',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-high)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--primary)' }}>
            file_upload
          </span>
          <span>Import Custom Language (.json)...</span>
        </button>

        <button
          type="button"
          onClick={handleExport}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            padding: '5px 8px',
            fontSize: '11px',
            color: 'var(--text-primary)',
            background: 'none',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-high)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#10b981' }}>
            file_download
          </span>
          <span>Export Current Language Pack</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose()
            onOpenSettings('language')
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            padding: '5px 8px',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            background: 'none',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface-high)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
            settings
          </span>
          <span>Language Preferences in Settings</span>
        </button>
      </div>
    </div>
  )
}
