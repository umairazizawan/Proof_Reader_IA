import { useState } from 'react';
import './index.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState('reader'); // "reader" or "history"

  // parse the raw string from the API into named sections
  const parseResult = (raw) => {
    const sections = {};
    const regex = /(REVISED|CHANGES|Theme|Tips):\s*([\s\S]*?)(?=(?:REVISED|CHANGES|Theme|Tips):|$)/g;
    let match;
    while ((match = regex.exec(raw))) {
      sections[match[1].toLowerCase()] = match[2].trim();
    }
    return sections;
  };

  const analyze = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await resp.json();
      if (data.result) {
        setResult(parseResult(data.result));
      } else {
        setResult({ error: 'Invalid response from server' });
      }
    } catch (err) {
      console.error(err);
      setResult({ error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>AI Proof Reader</h1>
      </header>
      <div className="container">
        <nav className="sidebar">
          <ul>
            <li>
              <a
                href="#"
                className={page === 'reader' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setPage('reader');
                }}
              >
                Proof Reader
              </a>
            </li>
            <li>
              <a
                href="#"
                className={page === 'history' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  setPage('history');
                }}
              >
                History
              </a>
            </li>
          </ul>
        </nav>
        <main className="main-content">
          {page === 'reader' ? (
            <>
              <textarea
                rows={8}
                cols={60}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste text here..."
              />
              <br />
              <button onClick={analyze} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze'}
              </button>

              {result && (
                <div className="result-sections">
              {result.error && <p className="error">{result.error}</p>}
              {result.revised && (
                <section>
                  <h2>Revised</h2>
                  <textarea
                    readOnly
                    rows={4}
                    cols={60}
                    value={result.revised}
                  />
                </section>
              )}
              {result.changes && (
                <section>
                  <h2>Changes</h2>
                  <textarea
                    readOnly
                    rows={4}
                    cols={60}
                    value={result.changes}
                  />
                </section>
              )}
              {result.theme && (
                <section>
                  <h2>Theme</h2>
                  <textarea
                    readOnly
                    rows={2}
                    cols={60}
                    value={result.theme}
                  />
                </section>
              )}
              {result.tips && (
                <section>
                  <h2>Tips</h2>
                  <textarea
                    readOnly
                    rows={3}
                    cols={60}
                    value={result.tips}
                  />
                </section>
              )}
            </div>
              )}
            </>
          ) : (
            <div className="coming-soon">
              <h2>Coming soon</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
