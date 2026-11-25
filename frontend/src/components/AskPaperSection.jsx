import React, { useState } from 'react';
import { Send, Sparkles, HelpCircle, Bot, User, CornerDownRight } from 'lucide-react';
import { papersAPI } from '../api/papers';

export default function AskPaperSection({ paper }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: `Hello! I'm your research assistant for "${paper.title}". You can ask me about the methodology, evaluation metrics, datasets, or core hypotheses. Click one of the quick suggestions below or type your own question!`,
      source: 'ScholarLens AI',
    }
  ]);
  const [error, setError] = useState('');

  const quickPrompts = [
    'Explain the core breakthrough simply',
    'What architecture or method is proposed?',
    'What datasets and benchmarks were used?',
    'What are the main limitations or trade-offs?',
  ];

  const handleAsk = async (queryText) => {
    const q = (queryText || question).trim();
    if (!q || loading) return;

    setError('');
    const userMsg = { role: 'user', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setLoading(true);

    try {
      const response = await papersAPI.askQuestion(paper.arxiv_id, q);
      if (response.success && response.answer) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: response.answer,
            source: response.source === 'NEMOTRON_LLM' ? '⚡ NVIDIA Nemotron' : 'Academic NLP Engine',
          }
        ]);
      } else {
        throw new Error(response.error?.message || 'Could not retrieve answer.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to query the research assistant.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'I encountered an issue processing that query. Please try rephrasing or click one of the suggested prompts.',
          source: 'System',
          isError: true,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="academic-card" style={{ marginBottom: '2.5rem', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.75rem', backgroundColor: 'var(--bg-muted)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
              Ask the Paper (Interactive AI Assistant)
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 0 }}>
              Directly interrogate preprint methodology, baseline comparisons, and empirical results
            </p>
          </div>
        </div>
        <span className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
          arXiv:{paper.arxiv_id}
        </span>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div style={{ padding: '0.85rem 1.75rem', backgroundColor: '#fafafa', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <HelpCircle size={13} /> Quick Prompts:
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleAsk(prompt)}
            disabled={loading}
            style={{
              fontSize: '0.75rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '16px',
              border: '1px solid var(--border-strong)',
              backgroundColor: '#ffffff',
              color: 'var(--text-main)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary-light)';
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = 'var(--border-strong)';
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Thread Container */}
      <div style={{ padding: '1.5rem 1.75rem', maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#ffffff' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: msg.role === 'user' ? 'var(--accent-primary)' : '#f1f5f9',
                color: msg.role === 'user' ? '#ffffff' : 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>

            {/* Bubble */}
            <div
              style={{
                maxWidth: '82%',
                backgroundColor: msg.role === 'user' ? 'var(--accent-primary-light)' : 'var(--bg-subtle)',
                color: 'var(--text-main)',
                padding: '0.85rem 1.15rem',
                borderRadius: '8px',
                border: msg.role === 'user' ? '1px solid rgba(37,99,235,0.2)' : '1px solid var(--border-subtle)',
                lineHeight: 1.6,
                fontSize: '0.875rem',
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              {msg.source && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.6875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <CornerDownRight size={11} /> {msg.source}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
            <div className="spinner" style={{ width: '1rem', height: '1rem' }}></div>
            <span>Analyzing paper preprint and generating synthesis...</span>
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: '0.5rem 1.75rem', backgroundColor: 'var(--accent-rose-light)', color: 'var(--accent-rose)', fontSize: '0.8125rem' }}>
          {error}
        </div>
      )}

      {/* Input Bar */}
      <div style={{ padding: '1rem 1.75rem', backgroundColor: 'var(--bg-muted)', borderTop: '1px solid var(--border-subtle)' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk();
          }}
          style={{ display: 'flex', gap: '0.75rem' }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Ask anything about this paper (e.g. 'What was the BLEU score on WMT 2014?')..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ flex: 1, backgroundColor: '#ffffff' }}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !question.trim()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.65rem 1.25rem' }}
          >
            <Send size={15} />
            <span>Ask</span>
          </button>
        </form>
      </div>
    </div>
  );
}
