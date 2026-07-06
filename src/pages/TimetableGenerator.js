// TimetableGenerator.js
// Standalone timetable generator page — works without login
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './TimetableGenerator.css';

const API_URL = 'http://localhost:5000/api/generate-timetable';
const LS_KEY = 'lastGeneratedTimetable';

// Distinct pastel colours cycled per subject for visual clarity
const COLOURS = [
  '#d0e8ff', '#d4f7d4', '#fff3cd', '#fde2e2',
  '#e8d5f5', '#ffd6a5', '#caffbf', '#fdffb6',
  '#c8e6c9', '#f8bbd0',
];

export default function TimetableGenerator() {
  // ── Form state ──────────────────────────────────────────────
  const [form, setForm] = useState({
    className: '',
    subjectsRaw: '',   // comma-separated string from input
    days: 5,
    periodsPerDay: 6,
  });

  // ── Result state ────────────────────────────────────────────
  const [result, setResult] = useState(null);   // API response
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tableRef = useRef(null);

  // Load last timetable from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try { setResult(JSON.parse(saved)); } catch {}
    }
  }, []);

  // ── Helpers ─────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Map each unique subject to a stable colour
  const buildColourMap = (subjects) => {
    const map = {};
    subjects.forEach((s, i) => { map[s] = COLOURS[i % COLOURS.length]; });
    return map;
  };

  // ── Generate ─────────────────────────────────────────────────
  const generate = async () => {
    setError('');

    // Client-side validation
    const subjects = form.subjectsRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (!form.className.trim()) { setError('Please enter a class name.'); return; }
    if (subjects.length === 0)  { setError('Please enter at least one subject.'); return; }
    if (form.days < 1 || form.days > 7) { setError('Days must be between 1 and 7.'); return; }
    if (form.periodsPerDay < 1 || form.periodsPerDay > 12) { setError('Periods per day must be between 1 and 12.'); return; }

    setLoading(true);
    try {
      const { data } = await axios.post(API_URL, {
        className: form.className.trim(),
        subjects,
        days: Number(form.days),
        periodsPerDay: Number(form.periodsPerDay),
      });
      setResult(data);
      // Bonus: persist to localStorage
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // ── PDF Download ─────────────────────────────────────────────
  const downloadPDF = async () => {
    // Dynamically import jspdf + autotable so bundle stays small
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF({ orientation: 'landscape' });
    const dayNames = Object.keys(result.timetable);
    const periodHeaders = Array.from({ length: result.periodsPerDay }, (_, i) => `P${i + 1}`);

    doc.setFontSize(16);
    doc.text(`Timetable — Class ${result.className}`, 14, 16);
    doc.setFontSize(10);
    doc.text(`Subjects: ${result.subjects.join(', ')}`, 14, 24);

    autoTable(doc, {
      startY: 30,
      head: [['Day', ...periodHeaders]],
      body: dayNames.map(day => [day, ...result.timetable[day]]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [52, 152, 219], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 248, 255] },
    });

    doc.save(`timetable-class-${result.className}.pdf`);
  };

  // ── Render ───────────────────────────────────────────────────
  const colourMap = result ? buildColourMap(result.subjects) : {};
  const dayNames  = result ? Object.keys(result.timetable) : [];
  const periodHeaders = result
    ? Array.from({ length: result.periodsPerDay }, (_, i) => `Period ${i + 1}`)
    : [];

  return (
    <div className="tg-page">
      {/* ── Header ── */}
      <header className="tg-header">
        <div className="tg-header-inner">
          <h1>🗓 Timetable Generator</h1>
          <p>Fill in the details below and click <strong>Generate</strong></p>
        </div>
      </header>

      <main className="tg-main">
        {/* ── Form Card ── */}
        <section className="tg-card tg-form-card">
          <h2>Class Details</h2>

          <div className="tg-form-grid">
            {/* Class Name */}
            <div className="tg-field">
              <label htmlFor="className">Class Name</label>
              <input
                id="className"
                name="className"
                type="text"
                placeholder="e.g. A, CS-B, 10th"
                value={form.className}
                onChange={handleChange}
              />
            </div>

            {/* Days */}
            <div className="tg-field">
              <label htmlFor="days">Number of Days <span className="tg-hint">(1–7)</span></label>
              <input
                id="days"
                name="days"
                type="number"
                min="1" max="7"
                value={form.days}
                onChange={handleChange}
              />
            </div>

            {/* Periods */}
            <div className="tg-field">
              <label htmlFor="periodsPerDay">Periods per Day <span className="tg-hint">(1–12)</span></label>
              <input
                id="periodsPerDay"
                name="periodsPerDay"
                type="number"
                min="1" max="12"
                value={form.periodsPerDay}
                onChange={handleChange}
              />
            </div>

            {/* Subjects — full width */}
            <div className="tg-field tg-field-full">
              <label htmlFor="subjectsRaw">
                Subjects <span className="tg-hint">(comma-separated)</span>
              </label>
              <input
                id="subjectsRaw"
                name="subjectsRaw"
                type="text"
                placeholder="e.g. Math, English, DS, DBMS, Java"
                value={form.subjectsRaw}
                onChange={handleChange}
              />
              {/* Live subject chips preview */}
              {form.subjectsRaw && (
                <div className="tg-chips">
                  {form.subjectsRaw.split(',').map(s => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} className="tg-chip" style={{ background: COLOURS[i % COLOURS.length] }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && <div className="tg-error">⚠ {error}</div>}

          {/* Action buttons */}
          <div className="tg-actions">
            <button
              className="tg-btn tg-btn-primary"
              onClick={generate}
              disabled={loading}
            >
              {loading ? (
                <><span className="tg-spinner" /> Generating…</>
              ) : (
                '⚡ Generate Timetable'
              )}
            </button>

            {result && (
              <>
                <button className="tg-btn tg-btn-secondary" onClick={generate} disabled={loading}>
                  🔄 Regenerate
                </button>
                <button className="tg-btn tg-btn-pdf" onClick={downloadPDF}>
                  📄 Download PDF
                </button>
              </>
            )}
          </div>
        </section>

        {/* ── Timetable Result ── */}
        {result && (
          <section className="tg-card tg-result-card">
            <div className="tg-result-header">
              <h2>
                Timetable — Class <span className="tg-class-badge">{result.className}</span>
              </h2>
              <p className="tg-meta">
                {result.days} day{result.days > 1 ? 's' : ''} &nbsp;·&nbsp;
                {result.periodsPerDay} period{result.periodsPerDay > 1 ? 's' : ''}/day &nbsp;·&nbsp;
                {result.subjects.length} subject{result.subjects.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Subject legend */}
            <div className="tg-legend">
              {result.subjects.map((s, i) => (
                <span key={s} className="tg-legend-item" style={{ background: colourMap[s] }}>
                  {s}
                </span>
              ))}
            </div>

            {/* Timetable table */}
            <div className="tg-table-wrapper" ref={tableRef}>
              <table className="tg-table">
                <thead>
                  <tr>
                    <th className="tg-th-day">Day</th>
                    {periodHeaders.map(p => (
                      <th key={p}>{p}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dayNames.map((day, di) => (
                    <tr key={day} className={di % 2 === 0 ? 'tg-row-even' : 'tg-row-odd'}>
                      <td className="tg-day-cell">{day}</td>
                      {result.timetable[day].map((subject, pi) => (
                        <td
                          key={pi}
                          className="tg-subject-cell"
                          style={{ background: colourMap[subject] }}
                        >
                          {subject}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="tg-saved-note">✅ Timetable saved to local storage automatically.</p>
          </section>
        )}
      </main>
    </div>
  );
}
