import React from 'react';
import { BookOpen, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', marginTop: '4rem', padding: '3rem 0 2rem' }}>
      <div className="portal-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          
          {/* Column 1: Project Identity */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ backgroundColor: 'var(--accent-primary)', color: '#fff', padding: '0.35rem', borderRadius: '4px' }}>
                <BookOpen size={16} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>ScholarLens</span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              A full-stack academic paper research and structured synthesis platform developed for college Django course evaluation.
              Seamlessly integrates arXiv API retrieval, deterministic academic NLP structuring, user research collections, and BibTeX citation generation.
            </p>
          </div>


          
          <div>
            <h4 style={{ fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Academic Integrity
            </h4>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.75rem' }}>
              Paper abstracts and metadata are retrieved directly via the official Cornell arXiv.org API.
              All summaries provide deterministic sectioning, methodology highlights, and standard BibTeX formatting.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              <ShieldCheck size={14} /> Zero Vendor-Lock / Offline Fallback Included
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
          <div>
            &copy; {new Date().getFullYear()} ScholarLens. Designed for academic and educational evaluation.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>REST API v1.0</span>
            <span>arXiv Atom Feed Standard</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

