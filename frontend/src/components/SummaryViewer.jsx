import React, { useState, useEffect } from 'react';
import {
  Check, Copy, BookOpen, Layers, Lightbulb, Compass, AlertCircle, Quote,
  Volume2, VolumeX, Download, FileDown
} from 'lucide-react';

export default function SummaryViewer({ summary, bibtex, paperTitle, paper }) {
  const [activeTab, setActiveTab] = useState('executive');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mdCopied, setMdCopied] = useState(false);
  const [mdDownloaded, setMdDownloaded] = useState(false);

  // Check speech synthesis support
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (speechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [speechSupported]);

  if (!summary) {
    return (
      <div className="academic-card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: 'var(--bg-subtle)' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
          No structured synthesis has been generated for this paper yet.
        </p>
      </div>
    );
  }

  // Feature 1: Audio Narration (Text-to-Speech)
  const handleToggleSpeech = () => {
    if (!speechSupported) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Determine the most informative text to speak based on context
    let textToRead = '';
    if (activeTab === 'lay') {
      textToRead = `Plain language overview for ${paper?.title || paperTitle}. ${summary.lay_summary}`;
    } else if (activeTab === 'findings') {
      const findingsText = (summary.key_findings || []).join('. ');
      textToRead = `Key findings for ${paper?.title || paperTitle}. ${findingsText}`;
    } else if (activeTab === 'methodology') {
      textToRead = `Methodology for ${paper?.title || paperTitle}. ${summary.methodology}`;
    } else if (activeTab === 'limitations') {
      textToRead = `Limitations and research scope. ${summary.limitations}`;
    } else {
      textToRead = `Executive synthesis for ${paper?.title || paperTitle}. ${summary.executive_summary}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95; // Natural conversational academic pace
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Feature 2: Generate Formatted Markdown Research Brief
  const generateMarkdown = () => {
    const title = paper?.title || paperTitle || 'Academic Paper';
    const arxivId = paper?.arxiv_id || 'N/A';
    const category = paper?.category || 'General';
    const published = paper?.published_date || 'N/A';
    const pdfUrl = paper?.pdf_url || `https://arxiv.org/abs/${arxivId}`;
    const authors = paper?.authors && paper.authors.length > 0
      ? paper.authors.map(a => a.name + (a.affiliation ? ` (${a.affiliation})` : '')).join(', ')
      : 'Authors not listed';

    const findingsBullets = (summary.key_findings || [])
      .map((f, i) => `${i + 1}. ${f}`)
      .join('\n');

    const keywordsList = (summary.keywords || [])
      .map(k => `\`${k}\``)
      .join(', ');

    return `# ${title}

> **arXiv ID:** [arXiv:${arxivId}](${pdfUrl})  
> **Classification:** ${category} | **Published:** ${published}  
> **Authors:** ${authors}  
> **PDF:** [Read Preprint](${pdfUrl})

---

## 1. Executive Summary
${summary.executive_summary || 'N/A'}

## 2. Key Empirical Findings
${findingsBullets || 'No specific findings extracted.'}

## 3. Methodology & Computational Pipeline
${summary.methodology || 'N/A'}

## 4. Plain-Language Explanation (Lay Summary)
${summary.lay_summary || 'N/A'}

## 5. Identified Limitations & Future Directions
${summary.limitations || 'N/A'}

## 6. Scientific Keywords
${keywordsList || 'N/A'}

---

## BibTeX Citation
\`\`\`bibtex
${bibtex || '% BibTeX entry not generated yet'}
\`\`\`

---
*Synthesized via ScholarLens Academic Literature Portal (${summary.generator_type === 'NEMOTRON_LLM' ? 'NVIDIA Nemotron 3 Ultra' : 'Deterministic Academic NLP'})*
`;
  };

  // Download Research Brief as .md file
  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeId = (paper?.arxiv_id || 'paper').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `${safeId}_Research_Brief.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setMdDownloaded(true);
    setTimeout(() => setMdDownloaded(false), 2200);
  };

  // Copy Markdown directly for Notion/Obsidian
  const handleCopyMarkdown = () => {
    const md = generateMarkdown();
    navigator.clipboard.writeText(md);
    setMdCopied(true);
    setTimeout(() => setMdCopied(false), 2000);
  };

  const handleCopyBibtex = () => {
    if (bibtex) {
      navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs = [
    { id: 'executive', label: 'Executive Overview', icon: BookOpen },
    { id: 'findings', label: 'Key Findings', icon: Lightbulb },
    { id: 'methodology', label: 'Methodology', icon: Layers },
    { id: 'lay', label: 'Plain Language', icon: Compass },
    { id: 'limitations', label: 'Limitations & Scope', icon: AlertCircle },
    { id: 'bibtex', label: 'BibTeX Citation', icon: Quote },
  ];

  return (
    <div className="academic-card" style={{ overflow: 'hidden' }}>
      
      {/* Engine & Action Controls Bar */}
      <div style={{ padding: '0.85rem 1.5rem', backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Left: Badge & Keywords */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Structured Synthesis
          </span>
          <span className="badge badge-success" style={{ backgroundColor: summary.generator_type === 'NEMOTRON_LLM' ? '#f0fdf4' : undefined, color: summary.generator_type === 'NEMOTRON_LLM' ? '#166534' : undefined, borderColor: summary.generator_type === 'NEMOTRON_LLM' ? '#bbf7d0' : undefined }}>
            {summary.generator_type === 'NEMOTRON_LLM'
              ? '⚡ NVIDIA Nemotron 3 Ultra'
              : summary.generator_type === 'AI_LLM'
              ? 'AI Language Model'
              : 'Deterministic Academic NLP'}
          </span>

          {summary.keywords && summary.keywords.length > 0 && (
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {summary.keywords.slice(0, 3).map((kw, idx) => (
                <span key={idx} style={{ fontSize: '0.6875rem', padding: '0.15rem 0.45rem', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-muted)' }}>
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Interactive Audio Narration & Markdown Export Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          
          {/* Feature 1: Audio Narration Button */}
          {speechSupported && (
            <button
              onClick={handleToggleSpeech}
              className="btn btn-secondary btn-sm"
              style={{
                backgroundColor: isPlaying ? 'var(--accent-primary-light)' : '#ffffff',
                color: isPlaying ? 'var(--accent-primary)' : 'var(--text-main)',
                borderColor: isPlaying ? 'var(--accent-primary)' : 'var(--border-strong)',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              title={isPlaying ? 'Pause speech narration' : 'Listen to summary via speech audio'}
            >
              {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isPlaying ? 'Stop Audio' : 'Listen to Synthesis'}</span>
              {isPlaying && (
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', animation: 'pulse 1.2s infinite' }} />
              )}
            </button>
          )}

          {/* Feature 2: Export Research Brief to Markdown (.md) */}
          <button
            onClick={handleDownloadMarkdown}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Download complete structured research brief in Markdown (.md) format"
          >
            {mdDownloaded ? <Check size={14} color="var(--accent-emerald)" /> : <Download size={14} />}
            <span>{mdDownloaded ? 'Saved .md' : 'Export Brief (.md)'}</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="btn btn-secondary btn-sm"
            style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            title="Copy entire synthesis in Markdown for Notion or Obsidian"
          >
            {mdCopied ? <Check size={14} color="var(--accent-emerald)" /> : <FileDown size={14} />}
            <span>{mdCopied ? 'Copied' : 'Copy for Notion'}</span>
          </button>

        </div>

      </div>

      {/* Tabs Header */}
      <div className="tab-list" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div style={{ padding: '1.75rem' }}>
        
        {/* 1. Executive Summary */}
        {activeTab === 'executive' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Core Research Problem & Synthesis
              </h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Discourse-Structured Extraction
              </span>
            </div>
            <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-main)', fontFamily: 'var(--font-serif)', backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: '6px', borderLeft: '4px solid var(--accent-primary)' }}>
              {summary.executive_summary}
            </div>
          </div>
        )}

        {/* 2. Key Findings */}
        {activeTab === 'findings' && (
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>
              Empirical Findings & Contributions
            </h4>
            {summary.key_findings && summary.key_findings.length > 0 ? (
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {summary.key_findings.map((item, index) => (
                  <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '22px', height: '22px', borderRadius: '50%', backgroundColor: 'var(--accent-primary-light)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0, marginTop: '2px' }}>
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>No bulleted findings extracted.</p>
            )}
          </div>
        )}

        {/* 3. Methodology */}
        {activeTab === 'methodology' && (
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Architecture, Formulation & Methodology
            </h4>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-main)' }}>
              {summary.methodology || 'No specific methodology breakdown available.'}
            </p>
          </div>
        )}

        {/* 4. Layperson Explanation */}
        {activeTab === 'lay' && (
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Plain-Language Explanation (Non-Specialist Summary)
            </h4>
            <div style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-muted)', backgroundColor: '#fcfcfc', border: '1px solid var(--border-subtle)', padding: '1.25rem', borderRadius: '6px' }}>
              {summary.lay_summary || 'No layperson rewrite available.'}
            </div>
          </div>
        )}

        {/* 5. Limitations & Future Directions */}
        {activeTab === 'limitations' && (
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
              Scientific Scope & Identified Limitations
            </h4>
            <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--text-main)' }}>
              {summary.limitations || 'No explicit constraints reported in abstract extraction.'}
            </p>
          </div>
        )}

        {/* 6. BibTeX Citation */}
        {activeTab === 'bibtex' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-main)' }}>
                BibTeX Reference Entry
              </h4>
              <button
                onClick={handleCopyBibtex}
                className="btn btn-secondary btn-sm"
              >
                {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                {copied ? 'Copied to Clipboard' : 'Copy BibTeX'}
              </button>
            </div>
            <pre style={{ backgroundColor: '#0f172a', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', overflowX: 'auto', lineHeight: 1.5 }}>
              {bibtex || '% BibTeX entry not generated yet'}
            </pre>
          </div>
        )}

      </div>
    </div>
  );
}

