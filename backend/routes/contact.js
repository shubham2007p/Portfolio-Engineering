const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// ── POST /api/contact ─────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // ── Basic validation ────────────────────────────────────────────────────
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (message.trim().length < 10) {
    return res.status(400).json({ error: 'Message too short.' });
  }

  // ── Send email ──────────────────────────────────────────────────────────
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS   // Gmail App Password (not account password)
      }
    });

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `📬 New message from ${name} — Portfolio`,
      html: `
        <div style="font-family: 'Courier New', monospace; background: #0d0d0d; color: #e0e0e0; padding: 32px; border-radius: 8px; max-width: 600px;">
          <div style="border-bottom: 1px solid #333; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #fff; font-size: 18px; letter-spacing: 2px;">NEW CONTACT MESSAGE</h2>
            <p style="margin: 4px 0 0; color: #666; font-size: 12px;">via shubham-portfolio // ${new Date().toISOString()}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr>
              <td style="color: #888; font-size: 11px; letter-spacing: 1px; padding: 8px 0; width: 80px;">NAME</td>
              <td style="color: #e0e0e0; font-size: 14px; padding: 8px 0;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="color: #888; font-size: 11px; letter-spacing: 1px; padding: 8px 0;">EMAIL</td>
              <td style="color: #e0e0e0; font-size: 14px; padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #9b8bff;">${escapeHtml(email)}</a></td>
            </tr>
          </table>
          <div style="background: #1a1a1a; border: 1px solid #2a2a2a; border-radius: 4px; padding: 20px;">
            <p style="color: #888; font-size: 11px; letter-spacing: 1px; margin: 0 0 12px;">MESSAGE</p>
            <p style="color: #e0e0e0; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          <p style="color: #444; font-size: 11px; margin: 24px 0 0; text-align: center;">Reply to this email to respond directly to ${escapeHtml(name)}</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('[Contact email error]', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = router;
