import { useState } from 'react';
import './index.css';

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await resp.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Proofreader POC</h1>
      <textarea
        rows={10}
        cols={60}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={analyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {result && (
        <pre className="result">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
