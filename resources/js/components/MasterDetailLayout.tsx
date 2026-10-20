import type { ReactNode } from 'react';

type MasterDetailLayoutProps = {
  master: ReactNode;
  detail: ReactNode;
};

/** Shared desktop layout for a selectable list and its related-record panel. */
export default function MasterDetailLayout({ master, detail }: MasterDetailLayoutProps) {
  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start' }}>
      <div style={{ flex: '1 1 0', minWidth: 0, paddingRight: '1.5rem' }}>{master}</div>
      <div style={{ width: '1px', background: '#e5e7eb', alignSelf: 'stretch', flexShrink: 0 }} />
      <div style={{ flex: '1 1 0', minWidth: 0, paddingLeft: '1.5rem' }}>{detail}</div>
    </div>
  );
}
