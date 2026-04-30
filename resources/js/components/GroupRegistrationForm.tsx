import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

export default function GroupRegistrationForm({ onSuccess }: Props) {
  const [groupName, setGroupName] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/groups/join', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_name: groupName, access_key: accessKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Invalid group name or access key');
      } else {
        onSuccess();
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem', width: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 500, fontSize: '0.875rem', color: '#374151' }}>
          Group Name
        </label>
        <input
          type="text"
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter the group name"
          disabled={loading}
          style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 500, fontSize: '0.875rem', color: '#374151' }}>
          Secret Key
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type={showKey ? 'text' : 'password'}
            required
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder="Enter the group secret key"
            disabled={loading}
            style={{ width: '100%', padding: '0.5rem 2.5rem 0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            style={{ position: 'absolute', right: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', padding: 0 }}
            title={showKey ? 'Hide key' : 'Show key'}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', color: '#dc2626', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{ width: '100%', padding: '0.625rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.375rem', fontSize: '0.875rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
