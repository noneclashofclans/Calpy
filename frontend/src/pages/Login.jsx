import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', {
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                setSuccess(true);
                setTimeout(() => navigate('/dashboard'), 1200);
            }
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Geist:wght@300;400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                :root {
                    --bg: #0c0c0c;
                    --bg-card: #111111;
                    --bg-input: #161616;
                    --border: rgba(255,255,255,0.08);
                    --border-focus: rgba(255,255,255,0.22);
                    --text-primary: #f0f0f0;
                    --text-secondary: #6b6b6b;
                    --text-muted: #3d3d3d;
                    --accent: #e8ff6e;
                    --red: #ff5c5c;
                    --red-dim: rgba(255,92,92,0.08);
                    --radius: 10px;
                    --font: 'Geist', sans-serif;
                    --mono: 'Geist Mono', monospace;
                }

                html, body, #root { height: 100%; }

                .page {
                    min-height: 100vh;
                    background: var(--bg);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font);
                    color: var(--text-primary);
                    position: relative;
                    overflow: hidden;
                    padding: 5rem 1rem 2rem;
                }

                .page::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 28px 28px;
                    pointer-events: none;
                    z-index: 0;
                }

                .page::after {
                    content: '';
                    position: fixed;
                    top: -200px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 560px;
                    height: 380px;
                    background: radial-gradient(ellipse, rgba(232,255,110,0.055) 0%, transparent 70%);
                    pointer-events: none;
                    z-index: 0;
                }

                /* NAV */
                .nav {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 1.5rem;
                    border-bottom: 1px solid var(--border);
                    background: rgba(12,12,12,0.9);
                    backdrop-filter: blur(14px);
                    z-index: 10;
                }

                .nav-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                }

                .nav-icon {
                    width: 24px; height: 24px;
                    background: var(--accent);
                    border-radius: 6px;
                    display: grid;
                    place-items: center;
                    font-size: 13px;
                    line-height: 1;
                }

                .nav-name {
                    font-size: 0.875rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    letter-spacing: -0.02em;
                }

                .nav-links {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .nav-link {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .nav-link:hover { color: var(--text-primary); }

                /* CARD WRAP */
                .card-wrap {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 368px;
                    animation: fadeUp 0.3s ease both;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* KICKER */
                .kicker {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    margin-bottom: 1.25rem;
                }
                .kicker-bar { flex: 1; height: 1px; background: var(--border); }
                .kicker-text {
                    font-family: var(--mono);
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                /* CARD */
                .card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 1.75rem;
                    position: relative;
                    overflow: hidden;
                }

                .card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
                }

                .card-title {
                    font-size: 1.35rem;
                    font-weight: 600;
                    letter-spacing: -0.03em;
                    color: var(--text-primary);
                    margin-bottom: 0.3rem;
                }

                .card-sub {
                    font-size: 0.82rem;
                    color: var(--text-secondary);
                    margin-bottom: 1.5rem;
                    line-height: 1.5;
                }

                /* OAUTH */
                .oauth-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.5rem;
                    margin-bottom: 1.25rem;
                }

                .oauth-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.45rem;
                    padding: 0.6rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    background: transparent;
                    color: var(--text-primary);
                    font-family: var(--font);
                    font-size: 0.8rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: border-color 0.15s, background 0.15s;
                }
                .oauth-btn:hover {
                    border-color: var(--border-focus);
                    background: rgba(255,255,255,0.025);
                }

                /* DIVIDER */
                .divider {
                    display: flex;
                    align-items: center;
                    gap: 0.7rem;
                    margin-bottom: 1.25rem;
                }
                .divider::before, .divider::after {
                    content: ''; flex: 1; height: 1px;
                    background: var(--border);
                }
                .divider span {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    font-family: var(--mono);
                }

                /* FIELDS */
                .field { margin-bottom: 0.85rem; }

                .field-label {
                    display: block;
                    font-size: 0.74rem;
                    font-weight: 500;
                    color: var(--text-secondary);
                    margin-bottom: 0.4rem;
                }

                .field-input {
                    width: 100%;
                    padding: 0.65rem 0.8rem;
                    background: var(--bg-input);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    color: var(--text-primary);
                    font-family: var(--font);
                    font-size: 0.86rem;
                    outline: none;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .field-input::placeholder { color: var(--text-muted); }
                .field-input:focus {
                    border-color: var(--border-focus);
                    box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
                }

                /* ERROR */
                .error-box {
                    background: var(--red-dim);
                    border: 1px solid rgba(255,92,92,0.18);
                    border-radius: var(--radius);
                    padding: 0.6rem 0.8rem;
                    font-size: 0.78rem;
                    color: var(--red);
                    margin-bottom: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 0.45rem;
                }

                /* FORGOT */
                .forgot-row {
                    display: flex;
                    justify-content: flex-end;
                    margin-bottom: 1.1rem;
                    margin-top: -0.45rem;
                }
                .forgot-link {
                    font-size: 0.73rem;
                    color: var(--text-muted);
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .forgot-link:hover { color: var(--text-secondary); }

                /* SUBMIT */
                .submit-btn {
                    width: 100%;
                    padding: 0.7rem;
                    background: var(--text-primary);
                    color: #0c0c0c;
                    border: none;
                    border-radius: var(--radius);
                    font-family: var(--font);
                    font-size: 0.86rem;
                    font-weight: 600;
                    cursor: pointer;
                    letter-spacing: -0.01em;
                    transition: opacity 0.15s, transform 0.12s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.45rem;
                }
                .submit-btn:hover:not(:disabled) { opacity: 0.88; }
                .submit-btn:active:not(:disabled) { transform: scale(0.99); }
                .submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }
                .submit-btn.ok { background: var(--accent); }

                .spinner {
                    width: 13px; height: 13px;
                    border: 2px solid rgba(0,0,0,0.15);
                    border-top-color: #0c0c0c;
                    border-radius: 50%;
                    animation: spin 0.55s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* FOOTER */
                .card-footer {
                    text-align: center;
                    margin-top: 1.1rem;
                    font-size: 0.78rem;
                    color: var(--text-muted);
                }
                .card-footer a {
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .card-footer a:hover { color: var(--text-primary); }

                /* STATS */
                .stats {
                    display: flex;
                    justify-content: center;
                    gap: 2.5rem;
                    margin-top: 2.25rem;
                    position: relative;
                    z-index: 1;
                }

                .stat-num {
                    font-family: var(--mono);
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    text-align: center;
                }

                .stat-label {
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    margin-top: 0.2rem;
                    text-transform: uppercase;
                    letter-spacing: 0.07em;
                    text-align: center;
                }

                @media (max-width: 440px) {
                    .oauth-row { grid-template-columns: 1fr; }
                    .nav-links { gap: 1rem; }
                    .stats { gap: 1.5rem; }
                }
            `}</style>

            <nav className="nav">
                <a href="/" className="nav-logo">
                    <div className="nav-icon">🥗</div>
                    <span className="nav-name">Calpy</span>
                </a>
            </nav>

            <div className="page">
                <div className="card-wrap">

                    <div className="card">
                        <h1 className="card-title">Sign in</h1>
                        <p className="card-sub">Track your calories, macros, and progress.</p>

                        

                        {error && (
                            <div className="error-box">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="field">
                                <label className="field-label">Email</label>
                                <input
                                    className="field-input"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="field">
                                <label className="field-label">Password</label>
                                <input
                                    className="field-input"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            

                            <button
                                type="submit"
                                className={`submit-btn${success ? ' ok' : ''}`}
                                disabled={loading || success}
                            >
                                {loading ? (
                                    <><span className="spinner" />Signing in…</>
                                ) : success ? (
                                    <>✓ Redirecting</>
                                ) : (
                                    <>Sign in</>
                                )}
                            </button>
                        </form>

                        <p className="card-footer">
                            No account? <Link to="/register">Create one free</Link>
                        </p>
                    </div>

                    <div className="stats">
                        <div>
                            <div className="stat-num">2M+</div>
                            <div className="stat-label">Meals logged</div>
                        </div>
                        <div>
                            <div className="stat-num">50k</div>
                            <div className="stat-label">Active users</div>
                        </div>
                        <div>
                            <div className="stat-num">98%</div>
                            <div className="stat-label">Goal success</div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Login;