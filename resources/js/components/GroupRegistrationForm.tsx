import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onSuccess: () => void;
}

export default function GroupRegistrationForm({ onSuccess }: Props) {
  const { t } = useTranslation();
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
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_name: groupName, access_key: accessKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || t('groups.registration.invalidCredentials'));
      } else {
        onSuccess();
      }
    } catch {
      setError(t('groups.registration.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" style={{ marginTop: '1.5rem', width: '100%' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 500, fontSize: '0.875rem', color: '#374151' }}>
          {t('groups.registration.groupName')}
        </label>
        <input
          type="text"
          autoComplete="nope"
          name="grp_name_x"
          required
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder={t('groups.registration.groupNamePlaceholder')}
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 500, fontSize: '0.875rem', color: '#374151' }}>
          {t('groups.registration.secretKey')}
        </label>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type={showKey ? 'text' : 'password'}
            autoComplete="new-password"
            name="grp_key_x"
            required
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            placeholder={t('groups.registration.secretKeyPlaceholder')}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.5rem 2.5rem 0.5rem 0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            style={{
              position: 'absolute',
              right: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              padding: 0,
            }}
            title={showKey ? t('groups.hideKey') : t('groups.showKey')}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '0.375rem',
            color: '#dc2626',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.625rem',
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '0.375rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? t('groups.registration.registering') : t('groups.registration.register')}
      </button>
    </form>
  );
}
