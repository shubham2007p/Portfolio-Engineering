import React, { useState } from 'react';
import { postApi } from '../hooks/useApi';

const socials = [
  { num: '01', label: 'email', href: 'mailto:shubham.panwar.dev@gmail.com', value: 'shubham.panwar.dev@gmail.com' },
  { num: '02', label: 'github', href: 'https://github.com/shubh-panwar', value: 'github.com/shubh-panwar' },
  { num: '03', label: 'linkedin', href: 'https://linkedin.com/in/shubh-panwar', value: 'linkedin.com/in/shubh-panwar' },
  { num: '04', label: 'x-twitter', href: 'https://x.com/shubh-panwar', value: 'x.com/shubh-panwar' }
];

function ConnectSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const { ok, error } = await postApi('/api/contact', form);

    if (ok) {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } else {
      setStatus('error');
      setErrorMsg(error || 'Something went wrong.');
    }
  };

  return (
    <section className="connect-section-container" id="connect-section">
      <div className="connect-wrapper">
        
        {/* Main Double Header */}
        <div className="connect-header-wrapper">
          <h2 className="connect-main-title">REACH OUT</h2>
          <div className="connect-sub-wrapper">
            <span className="connect-sub-title">CONNECT</span>
            <span className="connect-tag">/ socials // snap-007</span>
          </div>
        </div>

        {/* Large Typography Social Grid */}
        <div className="connect-links-flow">
          {socials.map((soc) => (
            <a 
              key={soc.num}
              href={soc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="connect-link-row"
            >
              <span className="connect-link-num">{soc.num}/</span>
              <span className="connect-link-label">{soc.label}</span>
              <span className="connect-link-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="connect-link-val">{soc.value}</span>
            </a>
          ))}
        </div>

        {/* ── Contact Form ──────────────────────────────────────────────── */}
        <div className="contact-form-wrapper">
          <div className="contact-form-header">
            <span className="contact-form-label">/ SEND A MESSAGE</span>
            <span className="contact-form-tag">direct comms // form-001</span>
          </div>

          {status === 'sent' ? (
            <div className="contact-success">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>MESSAGE TRANSMITTED. I'll respond within 24h.</span>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label className="contact-field-label" htmlFor="contact-name">NAME</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    className="contact-input"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-field-label" htmlFor="contact-email">EMAIL</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className="contact-input"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    required
                  />
                </div>
              </div>
              <div className="contact-field">
                <label className="contact-field-label" htmlFor="contact-message">MESSAGE</label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="contact-input contact-textarea"
                  placeholder="What's on your mind?"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  disabled={status === 'sending'}
                  required
                />
              </div>

              {status === 'error' && (
                <p className="contact-error">{errorMsg}</p>
              )}

              <button 
                type="submit" 
                className={`contact-submit ${status === 'sending' ? 'contact-submit--sending' : ''}`}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? (
                  <>
                    <span className="contact-spinner" />
                    TRANSMITTING…
                  </>
                ) : (
                  <>
                    SEND MESSAGE
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

export default ConnectSection;
