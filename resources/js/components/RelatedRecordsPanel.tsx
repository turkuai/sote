import { Plus, Search, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataSetView from '../../../grid/src/DataSetView';
import { getApiBase } from '../config';

type RelatedRecordsPanelProps = {
  title: string;
  selectedId: number | string;
  recordsUrl: string;
  candidatesUrl: string;
  relationUrl: string;
  label: (record: any) => string;
  description?: (record: any) => string;
  onChanged?: () => void;
};

export default function RelatedRecordsPanel({ title, selectedId, recordsUrl, candidatesUrl, relationUrl, label, description, onChanged }: RelatedRecordsPanelProps) {
  const { t } = useTranslation();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const selectedRef = useRef(selectedId);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const allRows: any[] = [];
      let page = 1;
      let lastPage = 1;
      do {
        const separator = recordsUrl.includes('?') ? '&' : '?';
        const response = await fetch(getApiBase() + recordsUrl + separator + 'page=' + page, { credentials: 'include', headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('Request failed (' + response.status + ')');
        const payload = await response.json();
        const rows = payload?.data?.users ?? payload?.data?.groups ?? payload?.data ?? payload?.users ?? payload?.groups ?? [];
        if (Array.isArray(rows)) allRows.push(...rows);
        lastPage = Number(payload?.pagination?.last_page ?? payload?.totalPages ?? payload?.last_page ?? 1);
        page += 1;
      } while (page <= lastPage);
      setRecords(allRows);
      setError('');
    } catch (e: any) {
      setError(e.message || 'Unable to load related records');
    } finally {
      setLoading(false);
    }
  }, [recordsUrl]);

  useEffect(() => {
    selectedRef.current = selectedId;
    setAdding(false);
    setSelected([]);
    loadRecords();
  }, [selectedId, loadRecords]);

  const loadCandidates = useCallback(async (page: number) => {
    const query = search.trim() ? '&search=' + encodeURIComponent(search.trim()) : '';
    const response = await fetch(getApiBase() + candidatesUrl + '?page=' + page + query, { credentials: 'include', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Request failed (' + response.status + ')');
    const payload = await response.json();
    const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
    const existing = new Set(records.map((record) => record.id));
    return rows.filter((record) => !existing.has(record.id));
  }, [candidatesUrl, records, search]);

  const save = async (record: any, method: 'POST' | 'DELETE') => {
    const response = await fetch(getApiBase() + relationUrl + '/' + record.id, { method, credentials: 'include', headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Request failed (' + response.status + ')');
  };

  const handleRemove = async (record: any) => {
    try {
      await save(record, 'DELETE');
      if (selectedRef.current === selectedId) await loadRecords();
      onChanged?.();
    } catch (e: any) {
      setError(e.message || 'Unable to update assignment');
    }
  };

  const handleAdd = async () => {
    setSaving(true);
    try {
      for (const record of selected) await save(record, 'POST');
      await loadRecords();
      setSelected([]);
      setAdding(false);
      onChanged?.();
    } catch (e: any) {
      setError(e.message || 'Unable to update assignment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="tab-header" style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white' }}>
        <h2>{title}</h2>
      </div>
      {error && <p role="alert" style={{ color: '#b91c1c' }}>{error}</p>}
      {loading ? <p style={{ color: '#6b7280' }}>{t('grid.loading')}</p> : (
        <>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '1rem' }}>
            <button className="server-grid-add-button" title={adding ? t('grid.confirmDelete.cancel') : t('groups.panel.addUser')} onClick={() => { setAdding((v) => !v); setSelected([]); }}>
              <Plus size={20} />
            </button>
            {adding && <button className="confirm-btn" disabled={!selected.length || saving} onClick={handleAdd}>{saving ? t('grid.loading') : 'Add ' + selected.length}</button>}
          </div>
          {records.length === 0 ? <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No assignments yet.</p> : (
            <div>{records.map((record) => (
              <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 0', borderBottom: '1px solid #e5e7eb' }}>
                <span>{label(record)}{description?.(record) ? <small style={{ display: 'block', color: '#6b7280' }}>{description(record)}</small> : null}</span>
                <button type="button" onClick={() => handleRemove(record)} title="Remove assignment" style={{ border: 0, background: 'none', color: '#b91c1c', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </div>
            ))}</div>
          )}
          {adding && (
            <div style={{ marginTop: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Search size={16} />
                <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" autoComplete="off" />
              </div>
              <div style={{ height: 240, overflow: 'auto' }}>
                <DataSetView key={selectedId + '-' + search} loadPage={loadCandidates} render={({ data }: { data: any }) => {
                  const checked = selected.some((item) => item.id === data.id);
                  return <label style={{ display: 'flex', gap: '0.5rem', padding: '0.45rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={checked} onChange={() => setSelected((items) => checked ? items.filter((item) => item.id !== data.id) : [...items, data])} />
                    <span>{label(data)}{description?.(data) ? ' · ' + description(data) : ''}</span>
                  </label>;
                }} />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
