import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const LandingPage = () => {
    const [user, setUser] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setDropdownOpen(false);
        navigate("/");
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Geist:wght@300;400;500;600;700&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                :root {
                    --bg: #0c0c0c;
                    --bg-card: #111111;
                    --bg-card-hover: #141414;
                    --bg-input: #161616;
                    --border: rgba(255,255,255,0.08);
                    --border-hover: rgba(255,255,255,0.14);
                    --border-focus: rgba(255,255,255,0.22);
                    --text-primary: #f0f0f0;
                    --text-secondary: #6b6b6b;
                    --text-muted: #3d3d3d;
                    --accent: #e8ff6e;
                    --accent-dim: rgba(232,255,110,0.08);
                    --radius: 10px;
                    --font: 'Geist', sans-serif;
                    --mono: 'Geist Mono', monospace;
                }

                html { scroll-behavior: smooth; }
                *, body { font-family: var(--font); }

                .lp {
                    background: var(--bg);
                    color: var(--text-primary);
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                .lp::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
                    background-size: 28px 28px;
                    pointer-events: none;
                    z-index: 0;
                }

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
                    z-index: 100;
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

                .nav-center {
                    display: flex;
                    align-items: center;
                    gap: 1.75rem;
                }

                .nav-link {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    text-decoration: none;
                    transition: color 0.15s;
                }
                .nav-link:hover { color: var(--text-primary); }

                .nav-right {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                }

                /* ── AVATAR & DROPDOWN ── */
                .user-profile {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                    padding: 0.2rem;
                    border-radius: 30px;
                    transition: background 0.2s;
                }
                .user-profile:hover { background: rgba(255,255,255,0.04); }

                .avatar-circle {
                    width: 32px; height: 32px;
                    background: var(--accent);
                    color: #0c0c0c;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                    font-weight: 600;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                }

                .user-name {
                    font-size: 0.8rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    padding-right: 0.4rem;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .dropdown-menu {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 12px;
                    padding: 0.4rem;
                    min-width: 140px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.2rem;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.6);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-8px);
                    transition: all 0.2s ease;
                }
                .dropdown-menu.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-item {
                    padding: 0.5rem 0.75rem;
                    border-radius: 6px;
                    color: var(--text-secondary);
                    font-size: 0.8rem;
                    font-weight: 500;
                    text-decoration: none;
                    text-align: left;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-family: var(--font);
                    transition: all 0.15s;
                }
                .dropdown-item:hover { background: var(--bg-card-hover); color: var(--text-primary); }
                .dropdown-item.text-danger:hover { color: #ff6b6b; background: rgba(255,107,107,0.08); }

                .dropdown-divider {
                    height: 1px;
                    background: var(--border);
                    margin: 0.2rem 0;
                }

                .btn-ghost {
                    padding: 0.42rem 0.9rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    background: transparent;
                    color: var(--text-secondary);
                    font-family: var(--font);
                    font-size: 0.8rem;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    transition: border-color 0.15s, color 0.15s;
                    display: inline-flex;
                    align-items: center;
                }
                .btn-ghost:hover { border-color: var(--border-focus); color: var(--text-primary); }

                .btn-primary {
                    padding: 0.42rem 0.9rem;
                    border: none;
                    border-radius: var(--radius);
                    background: var(--text-primary);
                    color: #0c0c0c;
                    font-family: var(--font);
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    transition: opacity 0.15s;
                }
                .btn-primary:hover { opacity: 0.88; }

                .hero {
                    position: relative;
                    z-index: 1;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 7rem 1.5rem 5rem;
                }

                .hero::after {
                    content: '';
                    position: absolute;
                    top: -180px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 700px;
                    height: 500px;
                    background: radial-gradient(ellipse, rgba(232,255,110,0.07) 0%, transparent 65%);
                    pointer-events: none;
                    z-index: 0;
                }

                .hero-inner { position: relative; z-index: 1; max-width: 680px; }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.3rem 0.75rem;
                    border: 1px solid var(--border);
                    border-radius: 99px;
                    font-family: var(--mono);
                    font-size: 0.68rem;
                    color: var(--text-muted);
                    letter-spacing: 0.08em;
                    text-transform: uppercase;
                    margin-bottom: 2rem;
                    background: rgba(255,255,255,0.02);
                }

                .hero-badge-dot {
                    width: 6px; height: 6px;
                    background: var(--accent);
                    border-radius: 50%;
                    animation: pulse 2s ease infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }

                .hero-title {
                    font-size: clamp(2.4rem, 6vw, 4rem);
                    font-weight: 700;
                    letter-spacing: -0.04em;
                    line-height: 1.08;
                    color: var(--text-primary);
                    margin-bottom: 1.25rem;
                }

                .hero-title em {
                    font-style: normal;
                    color: var(--accent);
                }

                .hero-sub {
                    font-size: 1rem;
                    color: var(--text-secondary);
                    line-height: 1.7;
                    max-width: 480px;
                    margin: 0 auto 2.25rem;
                }

                .hero-actions {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                    flex-wrap: wrap;
                }

                .btn-hero-primary {
                    padding: 0.72rem 1.4rem;
                    border: none;
                    border-radius: var(--radius);
                    background: var(--text-primary);
                    color: #0c0c0c;
                    font-family: var(--font);
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    transition: opacity 0.15s, transform 0.12s;
                    letter-spacing: -0.01em;
                }
                .btn-hero-primary:hover { opacity: 0.88; transform: translateY(-1px); }

                .btn-hero-ghost {
                    padding: 0.72rem 1.4rem;
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    background: transparent;
                    color: var(--text-secondary);
                    font-family: var(--font);
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    transition: border-color 0.15s, color 0.15s;
                }
                .btn-hero-ghost:hover { border-color: var(--border-focus); color: var(--text-primary); }

                .stats-strip {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    justify-content: center;
                    gap: 0;
                    border-top: 1px solid var(--border);
                    border-bottom: 1px solid var(--border);
                    background: rgba(255,255,255,0.01);
                    flex-wrap: wrap;
                }

                .stat-item {
                    flex: 1;
                    min-width: 140px;
                    padding: 1.75rem 1.5rem;
                    text-align: center;
                    border-right: 1px solid var(--border);
                }
                .stat-item:last-child { border-right: none; }

                .stat-num {
                    font-family: var(--mono);
                    font-size: 1.5rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    letter-spacing: -0.03em;
                }

                .stat-num span { color: var(--accent); }

                .stat-label {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    margin-top: 0.3rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                }

                .section {
                    position: relative;
                    z-index: 1;
                    max-width: 1080px;
                    margin: 0 auto;
                    padding: 5rem 1.5rem;
                }

                .section-kicker {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    margin-bottom: 1rem;
                }
                .kicker-bar { flex: 0 0 24px; height: 1px; background: var(--border); }
                .kicker-text {
                    font-family: var(--mono);
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .section-title {
                    font-size: clamp(1.6rem, 3.5vw, 2.4rem);
                    font-weight: 700;
                    letter-spacing: -0.035em;
                    line-height: 1.15;
                    color: var(--text-primary);
                    margin-bottom: 0.75rem;
                    max-width: 520px;
                }

                .section-sub {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    line-height: 1.7;
                    max-width: 460px;
                    margin-bottom: 2.5rem;
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1px;
                    background: var(--border);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    overflow: hidden;
                }

                .feature-card {
                    background: var(--bg-card);
                    padding: 1.75rem;
                    transition: background 0.2s;
                    cursor: default;
                }
                .feature-card:hover { background: var(--bg-card-hover); }

                .feature-icon {
                    width: 36px; height: 36px;
                    background: var(--accent-dim);
                    border: 1px solid rgba(232,255,110,0.15);
                    border-radius: 9px;
                    display: grid;
                    place-items: center;
                    font-size: 16px;
                    margin-bottom: 1rem;
                }

                .feature-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    letter-spacing: -0.02em;
                    margin-bottom: 0.45rem;
                }

                .feature-desc {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    line-height: 1.65;
                }

                .steps {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                }

                .step { position: relative; }

                .step-num {
                    font-family: var(--mono);
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    letter-spacing: 0.1em;
                    margin-bottom: 0.75rem;
                }

                .step-connector {
                    position: absolute;
                    top: 0.35rem;
                    left: calc(100% + 0.75rem);
                    right: calc(-100% + -0.75rem);
                    height: 1px;
                    background: linear-gradient(90deg, var(--border), transparent);
                    pointer-events: none;
                }

                .step:last-child .step-connector { display: none; }

                .step-title {
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    letter-spacing: -0.02em;
                    margin-bottom: 0.4rem;
                }

                .step-desc {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    line-height: 1.65;
                }

                .preview-wrap {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                    align-items: center;
                }

                .mock-card {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                }

                .mock-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 10%; right: 10%;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
                }

                .mock-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.25rem;
                }

                .mock-title {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .mock-date {
                    font-family: var(--mono);
                    font-size: 0.65rem;
                    color: var(--text-muted);
                }

                .mock-cal-ring {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                    padding-bottom: 1.25rem;
                    border-bottom: 1px solid var(--border);
                }

                .ring-wrap {
                    position: relative;
                    width: 64px; height: 64px;
                    flex-shrink: 0;
                }

                .ring-wrap svg { transform: rotate(-90deg); }

                .ring-center {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }

                .ring-cal {
                    font-family: var(--mono);
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    line-height: 1;
                }

                .ring-label {
                    font-size: 0.5rem;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                }

                .ring-info { flex: 1; }

                .ring-info-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.3rem;
                }

                .ring-info-label { font-size: 0.72rem; color: var(--text-secondary); }
                .ring-info-val { font-family: var(--mono); font-size: 0.72rem; color: var(--text-primary); }

                .macro-bars { display: flex; flex-direction: column; gap: 0.6rem; }

                .macro-row { display: flex; align-items: center; gap: 0.6rem; }

                .macro-name {
                    font-size: 0.7rem;
                    color: var(--text-secondary);
                    width: 52px;
                    flex-shrink: 0;
                }

                .macro-track {
                    flex: 1;
                    height: 4px;
                    background: rgba(255,255,255,0.06);
                    border-radius: 99px;
                    overflow: hidden;
                }

                .macro-fill {
                    height: 100%;
                    border-radius: 99px;
                    transition: width 0.6s ease;
                }

                .macro-pct {
                    font-family: var(--mono);
                    font-size: 0.65rem;
                    color: var(--text-muted);
                    width: 28px;
                    text-align: right;
                    flex-shrink: 0;
                }

                .pricing-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1px;
                    background: var(--border);
                    border: 1px solid var(--border);
                    border-radius: 14px;
                    overflow: hidden;
                    max-width: 640px;
                }

                .pricing-card {
                    background: var(--bg-card);
                    padding: 1.75rem;
                    position: relative;
                }

                .pricing-card.featured {
                    background: #121a0f;
                }

                .pricing-badge {
                    display: inline-block;
                    font-family: var(--mono);
                    font-size: 0.6rem;
                    color: #0c0c0c;
                    background: var(--accent);
                    padding: 0.18rem 0.5rem;
                    border-radius: 4px;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                    margin-bottom: 0.75rem;
                }

                .pricing-plan {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                }

                .pricing-price {
                    font-family: var(--mono);
                    font-size: 2rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    letter-spacing: -0.04em;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                }

                .pricing-price span {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    letter-spacing: 0;
                }

                .pricing-desc {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-bottom: 1.25rem;
                    line-height: 1.5;
                }

                .pricing-features {
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    margin-bottom: 1.5rem;
                }

                .pricing-feature {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.78rem;
                    color: var(--text-secondary);
                }

                .pricing-feature-dot {
                    width: 4px; height: 4px;
                    background: var(--accent);
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                .pricing-btn {
                    width: 100%;
                    padding: 0.65rem;
                    border-radius: var(--radius);
                    font-family: var(--font);
                    font-size: 0.82rem;
                    font-weight: 600;
                    cursor: pointer;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: opacity 0.15s;
                    letter-spacing: -0.01em;
                }

                .pricing-btn-outline {
                    border: 1px solid var(--border);
                    background: transparent;
                    color: var(--text-secondary);
                }
                .pricing-btn-outline:hover { border-color: var(--border-focus); color: var(--text-primary); }

                .pricing-btn-filled {
                    border: none;
                    background: var(--accent);
                    color: #0c0c0c;
                }
                .pricing-btn-filled:hover { opacity: 0.88; }

                .cta-section {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                    padding: 5rem 1.5rem 6rem;
                    border-top: 1px solid var(--border);
                }

                .cta-section::before {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 500px;
                    height: 300px;
                    background: radial-gradient(ellipse, rgba(232,255,110,0.05) 0%, transparent 70%);
                    pointer-events: none;
                }

                .cta-title {
                    font-size: clamp(1.8rem, 4vw, 3rem);
                    font-weight: 700;
                    letter-spacing: -0.04em;
                    color: var(--text-primary);
                    margin-bottom: 0.75rem;
                    line-height: 1.1;
                }

                .cta-sub {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin-bottom: 2rem;
                }

                .footer {
                    position: relative;
                    z-index: 1;
                    border-top: 1px solid var(--border);
                    padding: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .footer-left {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .footer-copy {
                    font-family: var(--mono);
                    font-size: 0.68rem;
                    color: var(--text-muted);
                }

                .fade-in {
                    opacity: 0;
                    transform: translateY(16px);
                    animation: fadeUp 0.5s ease forwards;
                }
                .fade-in-1 { animation-delay: 0.05s; }
                .fade-in-2 { animation-delay: 0.15s; }
                .fade-in-3 { animation-delay: 0.25s; }
                .fade-in-4 { animation-delay: 0.35s; }

                @keyframes fadeUp {
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .nav-center { display: none; }
                    .feature-grid { grid-template-columns: 1fr; }
                    .steps { grid-template-columns: 1fr; }
                    .step-connector { display: none; }
                    .preview-wrap { grid-template-columns: 1fr; }
                    .pricing-grid { grid-template-columns: 1fr; }
                    .stats-strip { flex-direction: row; }
                    .stat-item { border-right: none; border-bottom: 1px solid var(--border); }
                    .stat-item:last-child { border-bottom: none; }
                }
            `}</style>

            <div className="lp">
                <nav className="nav">
                    <a href="/" className="nav-logo">
                        <div className="nav-icon">🥗</div>
                        <span className="nav-name">Calpy</span>
                    </a>
                    <div className="nav-center">
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#how-it-works" className="nav-link">How it works</a>
                        <a href="#pricing" className="nav-link">Pricing</a>
                    </div>
                    <div className="nav-right">
                        {user ? (
                            <div className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                <div className="avatar-circle">
                                    {user.username ? user.username.charAt(0) : 'U'}
                                </div>
                                <span className="user-name">
                                    {user.username}
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>

                                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                                    <Link to="/dashboard" className="dropdown-item" onClick={(e) => e.stopPropagation()}>
                                        Dashboard
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="dropdown-item text-danger">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn-ghost">Sign in</Link>
                                <Link to="/register" className="btn-primary">Get started</Link>
                            </>
                        )}
                    </div>
                </nav>

                <section className="hero">
                    <div className="hero-inner">
                        <div className="hero-badge fade-in fade-in-1">
                            <span className="hero-badge-dot" />
                            Now in public beta
                        </div>
                        <h1 className="hero-title fade-in fade-in-2">
                            The smart way to<br />track <em>every calorie</em>
                        </h1>
                        <p className="hero-sub fade-in fade-in-3">
                            Log meals, monitor macros, and hit your goals — all in one clean dashboard. No subscriptions, no bloat.
                        </p>
                        <div className="hero-actions fade-in fade-in-4">
                            <Link to={user ? "/dashboard" : "/register"} className="btn-hero-primary">
                                {user ? "Go to Dashboard →" : "Start tracking free →"}
                            </Link>
                            <a href="#how-it-works" className="btn-hero-ghost">
                                See how it works
                            </a>
                        </div>
                    </div>
                </section>

                <div className="stats-strip">
                    {[
                        { num: '2M+', label: 'Meals logged' },
                        { num: '50k', label: 'Active users' },
                        { num: '300+', label: 'Food categories' },
                        { num: '98%', label: 'Goal success rate' },
                    ].map((s) => (
                        <div className="stat-item" key={s.label}>
                            <div className="stat-num"><span>{s.num}</span></div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>

                <section className="section" id="features">
                    <div className="section-kicker">
                        <div className="kicker-bar" />
                        <span className="kicker-text">Features</span>
                    </div>
                    <h2 className="section-title">Everything you need. Nothing you don't.</h2>
                    <p className="section-sub">Built for people who want real results without the complexity.</p>

                    <div className="feature-grid">
                        {[
                            { icon: '🔥', title: 'Calorie Tracking', desc: 'Log every meal in seconds. Search from thousands of foods or scan barcodes instantly.' },
                            { icon: '📊', title: 'Macro Breakdown', desc: 'See your protein, carbs, and fat split at a glance. Color-coded and always up to date.' },
                            { icon: '🎯', title: 'Goal Setting', desc: 'Set custom calorie and macro targets. We adjust your plan as your body changes.' },
                            { icon: '📈', title: 'Progress Charts', desc: 'Track trends over days, weeks, and months. Spot patterns and stay on course.' },
                            { icon: '💧', title: 'Hydration Log', desc: 'Monitor your water intake alongside your nutrition to stay fully on top of your health.' },
                            { icon: '⚡', title: 'Quick Add', desc: 'Repeat meals with one tap. Build custom recipes and log them as a single entry.' },
                        ].map((f) => (
                            <div className="feature-card" key={f.title}>
                                <div className="feature-icon">{f.icon}</div>
                                <div className="feature-title">{f.title}</div>
                                <div className="feature-desc">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section" id="how-it-works" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="section-kicker">
                        <div className="kicker-bar" />
                        <span className="kicker-text">How it works</span>
                    </div>
                    <h2 className="section-title">Up and running in minutes.</h2>
                    <p className="section-sub">No lengthy onboarding. Just sign up, set your goal, and start logging.</p>

                    <div className="steps">
                        {[
                            { n: '01', title: 'Create your account', desc: 'Sign up free in under 30 seconds. No credit card required.' },
                            { n: '02', title: 'Set your goal', desc: 'Tell us your target — lose weight, gain muscle, or maintain. We handle the math.' },
                            { n: '03', title: 'Log & track', desc: 'Search foods, scan barcodes, or use quick-add. Watch your dashboard update in real time.' },
                        ].map((s) => (
                            <div className="step" key={s.n}>
                                <div className="step-num">{s.n}</div>
                                <div className="step-title">{s.title}</div>
                                <div className="step-desc">{s.desc}</div>
                                <div className="step-connector" />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="section" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="preview-wrap">
                        <div className="preview-text">
                            <div className="section-kicker">
                                <div className="kicker-bar" />
                                <span className="kicker-text">Dashboard</span>
                            </div>
                            <h2 className="section-title">Your nutrition at a glance.</h2>
                            <p className="section-sub">A clean dashboard that shows you exactly where you stand — calories remaining, macros split, and daily progress all in one place.</p>
                            <Link to={user ? "/dashboard" : "/register"} className="btn-hero-primary" style={{ display: 'inline-flex' }}>
                                {user ? "View Dashboard →" : "Try it free →"}
                            </Link>
                        </div>

                        <div className="mock-card">
                            <div className="mock-header">
                                <span className="mock-title">Today's Summary</span>
                                <span className="mock-date">Mon, Mar 30</span>
                            </div>

                            <div className="mock-cal-ring">
                                <div className="ring-wrap">
                                    <svg width="64" height="64" viewBox="0 0 64 64">
                                        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                                        <circle cx="32" cy="32" r="26" fill="none" stroke="#e8ff6e" strokeWidth="6"
                                            strokeDasharray={`${2 * Math.PI * 26 * 0.68} ${2 * Math.PI * 26}`}
                                            strokeLinecap="round" />
                                    </svg>
                                    <div className="ring-center">
                                        <span className="ring-cal">1,340</span>
                                        <span className="ring-label">kcal</span>
                                    </div>
                                </div>
                                <div className="ring-info">
                                    <div className="ring-info-row">
                                        <span className="ring-info-label">Goal</span>
                                        <span className="ring-info-val">1,980 kcal</span>
                                    </div>
                                    <div className="ring-info-row">
                                        <span className="ring-info-label">Logged</span>
                                        <span className="ring-info-val">1,340 kcal</span>
                                    </div>
                                    <div className="ring-info-row">
                                        <span className="ring-info-label">Remaining</span>
                                        <span className="ring-info-val" style={{ color: '#e8ff6e' }}>640 kcal</span>
                                    </div>
                                </div>
                            </div>

                            <div className="macro-bars">
                                {[
                                    { name: 'Protein', pct: 72, fill: '#6bc46b' },
                                    { name: 'Carbs', pct: 55, fill: '#e8ff6e' },
                                    { name: 'Fat', pct: 40, fill: '#f0a500' },
                                ].map(m => (
                                    <div className="macro-row" key={m.name}>
                                        <span className="macro-name">{m.name}</span>
                                        <div className="macro-track">
                                            <div className="macro-fill" style={{ width: `${m.pct}%`, background: m.fill }} />
                                        </div>
                                        <span className="macro-pct">{m.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section" id="pricing" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="section-kicker">
                        <div className="kicker-bar" />
                        <span className="kicker-text">Pricing</span>
                    </div>
                    <h2 className="section-title">It's Free!</h2>
                    
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="pricing-plan">Free</div>
                            <div className="pricing-price">$0 <span>/ forever</span></div>
                            <div className="pricing-desc">Everything you need to get started tracking your nutrition.</div>
                            <ul className="pricing-features">
                                {['Calorie & macro tracking', 'Food database access', 'Daily & weekly summaries', 'Unlimited custom goals'].map(f => (
                                    <li className="pricing-feature" key={f}>
                                        <span className="pricing-feature-dot" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className="pricing-btn pricing-btn-outline" style={{background: "#ddf74f", color: 'black'}}>Get started free</Link>
                        </div>

                        
                    </div>
                </section>

                <section className="cta-section">
                    <h2 className="cta-title">Start tracking today.<br />It's free.</h2>
                    <p className="cta-sub">Join 50,000+ people already hitting their nutrition goals.</p>
                    <div className="hero-actions">
                        <Link to={user ? "/dashboard" : "/register"} className="btn-hero-primary">
                            {user ? "Back to Dashboard →" : "Create free account →"}
                        </Link>
                        {!user && <Link to="/login" className="btn-hero-ghost">Sign in</Link>}
                    </div>
                </section>

                <footer className="footer">
                    <div className="footer-left">
                        <div className="nav-icon" style={{ width: 20, height: 20, fontSize: 11 }}>🥗</div>
                        <span className="footer-copy">© 2026 Calpy</span>
                    </div>
                </footer>
            </div>
        </>
    );
};

export default LandingPage;