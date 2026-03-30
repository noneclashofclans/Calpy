import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0c0c0c;
    --bg-card: #111111;
    --bg-card-hover: #141414;
    --border: rgba(255,255,255,0.08);
    --t1: #f0f0f0;
    --t2: #6b6b6b;
    --t3: #3d3d3d;
    --accent: #e8ff6e;
    --danger: #ff6b6b;
    --font: 'Geist', sans-serif;
    --mono: 'Geist Mono', monospace;
  }

  body { background: var(--bg); color: var(--t1); font-family: var(--font); overflow-x: hidden; }
  .calpy { min-height: 100vh; display: flex; flex-direction: column; }
  
  .topbar { position: sticky; top: 0; z-index: 100; height: 56px; display: flex; align-items: center; justify-content: space-between; padding: 0 1.5rem; border-bottom: 1px solid var(--border); background: rgba(12,12,12,0.9); backdrop-filter: blur(14px); }
  .t-logo { display: flex; align-items: center; gap: 0.6rem; text-decoration: none; }
  .t-icon { width: 26px; height: 26px; background: var(--accent); border-radius: 7px; display: grid; place-items: center; font-size: 14px; color: #000; }
  .t-name { font-size: 1rem; font-weight: 600; color: var(--t1); letter-spacing: -0.02em; }

  .user-profile { position: relative; display: flex; align-items: center; gap: 0.6rem; cursor: pointer; padding: 0.4rem 0.8rem; border-radius: 40px; transition: background 0.2s; border: 1px solid var(--border); }
  .avatar-circle { width: 24px; height: 24px; background: var(--accent); color: #000; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 0.75rem; }
  
  .dropdown-menu { position: absolute; top: calc(100% + 10px); right: 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 0.5rem; min-width: 160px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); visibility: hidden; opacity: 0; transform: translateY(-10px); transition: 0.2s; z-index: 200; }
  .dropdown-menu.show { visibility: visible; opacity: 1; transform: translateY(0); }
  .dropdown-item { width: 100%; padding: 0.6rem 1rem; border-radius: 8px; color: var(--t2); font-size: 0.85rem; background: transparent; border: none; text-align: left; cursor: pointer; font-family: var(--font); }
  .dropdown-item:hover { background: var(--bg-card-hover); color: var(--t1); }

  .body { display: grid; grid-template-columns: 320px 1fr 340px; flex: 1; width: 100%; max-width: 1500px; margin: 0 auto; }
  .panel { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; overflow-y: auto; }
  .panel-left { border-right: 1px solid var(--border); }
  .panel-right { border-left: 1px solid var(--border); }

  .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; position: relative; }
  .card-label { font-family: var(--mono); font-size: 0.7rem; color: var(--t2); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 1.5rem; }

  /* MACRO ALIGNMENT FIX */
  .macro-item { margin-bottom: 1.5rem; }
  .macro-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
  .macro-label { font-size: 0.85rem; font-weight: 500; color: var(--t1); }
  .macro-stats { font-family: var(--mono); font-size: 0.72rem; color: var(--t2); }
  .macro-stats b { color: var(--t1); font-weight: 600; letter-spacing: -0.01em; }
  .macro-bar-bg { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
  .macro-bar-fill { height: 100%; border-radius: 10px; transition: width 0.8s ease-out; }

  .cam-area { border: 1px dashed var(--border); border-radius: 16px; min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.01); cursor: pointer; transition: 0.2s; }
  .cam-area:hover { background: rgba(232,255,110,0.03); border-color: var(--accent); }
  .cam-video, .cam-preview { width: 100%; border-radius: 12px; background: #000; object-fit: cover; max-height: 320px; }
  .btn-main { width: 100%; padding: 0.8rem; background: var(--accent); color: #000; border: none; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer; font-family: var(--font); transition: 0.2s; }
  .btn-main:hover { opacity: 0.9; transform: translateY(-1px); }

  .input-box { width: 100%; background: #181818; border: 1px solid var(--border); border-radius: 8px; padding: 0.7rem; color: #fff; font-family: var(--mono); margin-top: 5px; outline: none; margin-bottom: 10px; }
  .input-box:focus { border-color: var(--accent); }

  .tl-entry { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .tl-name { font-size: 0.85rem; font-weight: 500; color: var(--t1); }
  .tl-meta { font-size: 0.65rem; color: var(--t2); font-family: var(--mono); }

  .graph-container { display: flex; align-items: flex-end; justify-content: space-between; height: 100px; gap: 8px; }
  .graph-bar { width: 100%; background: rgba(255,255,255,0.03); border-radius: 4px; position: relative; height: 100px; overflow: hidden; }
  .graph-fill { position: absolute; bottom: 0; width: 100%; background: var(--t3); transition: 0.6s ease; }
  .graph-fill.active { background: var(--accent); }

  @media (max-width: 1100px) { .body { grid-template-columns: 1fr; } }
`;


async function analyzeFood(base64) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${VITE_GEMINI_API_KEY}`;

  const payload = {
    contents: [{
      parts: [
        {
          text: `You are a nutrition analysis expert. The user is logging their meals.
Analyze this food image and return nutrition data.
IMPORTANT: Almost every image will contain food. Be generous in your identification.
Even if the food is partial, packaged, or in a dish — still identify it.
Only return isFood:false if the image is clearly non-food (e.g. a person, landscape, document).
Return ONLY this JSON with no explanation:
{"isFood":true,"foodName":"name of food","calories":300,"protein":10,"carbs":40,"fat":8}`
        },
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: base64
          }
        }
      ]
    }],
    generationConfig: {
      thinkingConfig: { thinkingBudget: 0 },
      responseMimeType: "application/json"
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  console.log("RAW API RESPONSE:", JSON.stringify(data, null, 2));

  if (!response.ok) {
    throw new Error(data.error?.message || "Analysis failed");
  }

  const parts = data.candidates?.[0]?.content?.parts || [];
  console.log("PARTS:", parts);

  const textPart = parts.find(p => p.text && !p.thought);
  const text = textPart?.text || "{}";
  console.log("TEXT:", text);

  const clean = text.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  console.log("PARSED:", parsed);
  return parsed;
}

export default function CalpyDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || { username: "Unknown" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const goalsKey = `calpy_goals_${user.username}`;
  const entriesKey = `calpy_entries_${user.username}`;

  const [goals, setGoals] = useState(JSON.parse(localStorage.getItem(goalsKey)) || { daily: 1980, protein: 150, carbs: 220, fat: 65 });
  const [entries, setEntries] = useState(JSON.parse(localStorage.getItem(entriesKey)) || []);


  useEffect(() => {
    localStorage.setItem(entriesKey, JSON.stringify(entries));
  }, [entries, entriesKey]);


  const [isEditing, setIsEditing] = useState(false);

  const [mode, setMode] = useState('idle');
  const [img, setImg] = useState(null);
  const [result, setResult] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const totals = entries.reduce((a, e) => ({
    cal: a.cal + (e.calories || 0), protein: a.protein + (e.protein || 0), carbs: a.carbs + (e.carbs || 0), fat: a.fat + (e.fat || 0)
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

  const startCamera = async () => {
    setMode('live');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch { setMode('idle'); }
  };

  const takePhoto = () => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v) return;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d').drawImage(v, 0, 0);
    setImg(c.toDataURL('image/jpeg'));
    streamRef.current?.getTracks().forEach(t => t.stop());
    setMode('preview');
  };

  const processImage = async () => {
    setMode('analyzing');
    try {
      const data = await analyzeFood(img.split(',')[1]);
      setResult(data);
      setMode(data.isFood ? 'result' : 'notfood');
    } catch (e) {
      alert(e.message);
      setMode('idle');
    }
  };

  const handleLogout = (e) => {
    if (e) e.stopPropagation();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="calpy" onClick={() => setDropdownOpen(false)}>
      <style>{CSS}</style>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <header className="topbar">
        <Link className="t-logo" to="/">
          <div className="t-icon">🥗</div>
          <span className="t-name">Calpy</span>
        </Link>
        <div className="user-profile" onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}>
          <div className="avatar-circle">{user.username.charAt(0)}</div>
          <span className="t-name" style={{ fontSize: '0.8rem' }}>{user.username}</span>
          <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
            <button className="dropdown-item" onClick={() => setIsEditing(true)}>Set/Edit Goals</button>
            <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="body">
        <aside className="panel panel-left">
          {isEditing ? (
            <div className="card">
              <div className="card-label">Customize your goal</div>
              <label style={{ fontSize: '0.7rem', color: 'var(--t2)' }}>CALORIES</label>
              <input className="input-box" type="number" value={goals.daily} onChange={e => setGoals({ ...goals, daily: e.target.value })} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--t2' }}>P(g)</label><input className="input-box" type="number" value={goals.protein} onChange={e => setGoals({ ...goals, protein: e.target.value })} /></div>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--t2' }}>C(g)</label><input className="input-box" type="number" value={goals.carbs} onChange={e => setGoals({ ...goals, carbs: e.target.value })} /></div>
                <div><label style={{ fontSize: '0.8rem', color: 'var(--t2' }}>F(g)</label><input className="input-box" type="number" value={goals.fat} onChange={e => setGoals({ ...goals, fat: e.target.value })} /></div>
              </div>
              <button className="btn-main" onClick={() => { localStorage.setItem(goalsKey, JSON.stringify(goals)); setIsEditing(false); }}>Save Goal</button>
            </div>
          ) : (
            <div className="card">
              <div className="card-label">Daily Calorie</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ position: 'relative', width: 80, height: 80 }}>
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle cx="40" cy="40" r="35" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 35 * Math.min(totals.cal / goals.daily, 1)} 220`}
                      style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 600 }}>{totals.cal}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--t2)' }}>Remaining</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--accent)' }}>{Math.max(0, goals.daily - totals.cal)} <small style={{ fontSize: '0.6rem' }}>kcal</small></div>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-label">Others</div>
            {[
              { l: 'Protein', k: 'protein', c: '#6bcf7f' },
              { l: 'Carbs', k: 'carbs', c: '#e8ff6e' },
              { l: 'Fat', k: 'fat', c: '#f0a050' }
            ].map(m => (
              <div className="macro-item" key={m.k}>
                <div className="macro-header">
                  <span className="macro-label">{m.l}</span>
                  <span className="macro-stats"><b>{Math.round(totals[m.k])}g</b> / {goals[m.k]}g</span>
                </div>
                <div className="macro-bar-bg">
                  <div className="macro-bar-fill" style={{ width: `${Math.min((totals[m.k] / goals[m.k]) * 100, 100)}%`, background: m.c }} />
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="panel">
          <div className="card" style={{ flex: 1 }}>
            <div className="card-label">Meal Scanner</div>
            {mode === 'idle' && (
              <div className="cam-area" onClick={startCamera}>
                <span style={{ fontSize: '2rem' }}>📸</span>
                <span style={{ fontWeight: 600, marginTop: '10px', color: 'var(--t2)' }}>Capture Food</span>
              </div>
            )}
            {mode === 'live' && (
              <><video ref={videoRef} className="cam-video" autoPlay playsInline muted /><button className="btn-main" style={{ marginTop: '1rem' }} onClick={takePhoto}>Snap</button></>
            )}
            {mode === 'preview' && (
              <><img src={img} className="cam-preview" alt="preview" /><button className="btn-main" style={{ marginTop: '1rem' }} onClick={processImage}>Analyze with AI</button></>
            )}
            {mode === 'analyzing' && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--t2)' }}>Processing nutrition data...</div>}
            {mode === 'notfood' && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚫</div>
                <p style={{ color: 'var(--t2)', marginBottom: '1.5rem' }}>No food item detected</p>
                <button className="btn-main" onClick={() => { setImg(null); setMode('idle'); }}>Try Again</button>
              </div>
            )}
            {mode === 'result' && result && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', color: 'white' }}>{result.foodName}</h2>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)', margin: '10px 0' }}>
                  {result.calories} kcal
                </div>

                <p style={{ color: 'var(--t2)', marginBottom: '1rem' }}>
                  Is this correct?
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-main"
                    style={{ background: 'var(--accent)' }}
                    onClick={() => {
                      setEntries([
                        ...entries,
                        {
                          ...result,
                          id: Date.now(),
                          time: new Date().toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        }
                      ]);
                      setMode('idle');
                    }}
                  >
                    Yes
                  </button>

                  <button
                    className="btn-main"
                    style={{ background: 'var(--danger)', color: '#fff' }}
                    onClick={() => {
                      setResult(null);
                      setImg(null);
                      setMode('idle');
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        <aside className="panel panel-right">
          <div className="card">
            <div className="card-label">Today's Intake</div>
            <div className="graph-container">
              {['T', 'W', 'T', 'F', 'S', 'S', 'M'].map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div className="graph-bar">
                    <div className={`graph-fill ${i === 6 ? 'active' : ''}`} style={{ height: i === 6 ? `${Math.min((totals.cal / goals.daily) * 100, 100)}%` : '12%' }} />
                  </div>
                  <span style={{ fontSize: '0.6rem', color: 'var(--t3)', fontFamily: 'var(--mono)' }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ flex: 1 }}>
            <div className="card-label">History</div>
            {entries.length === 0 ? <p style={{ color: 'var(--t3)', textAlign: 'center' }}>Log a meal to start</p> : entries.map(e => (
              <div className="tl-entry" key={e.id}>
                <div style={{ flex: 1 }}>
                  <div className="tl-name">{e.foodName}</div>
                  <div className="tl-meta">{e.time} • {e.calories} kcal</div>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }} onClick={() => setEntries(entries.filter(x => x.id !== e.id))}>✕</button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}