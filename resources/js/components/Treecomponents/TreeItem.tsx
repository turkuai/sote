import { ChevronDown, ChevronRight } from 'lucide-react';
import { CSSProperties, ReactNode, useState } from 'react';

interface TreeItemProps {
  content: ReactNode;
  children?: ReactNode;
  contentStyle?: CSSProperties;
}

export function TreeItem({ content, children, contentStyle }: TreeItemProps) {
  const [open, setOpen] = useState(true);
  const hasChildren = !!children;

  return (
    <div>
      <div
        onClick={() => hasChildren && setOpen(!open)}
        style={{
          cursor: hasChildren ? 'pointer' : 'default',
          fontWeight: 400,
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 0',
          opacity: hasChildren ? 1 : 0.85,
          ...contentStyle,
        }}
      >
        {hasChildren && (open ? <ChevronDown size={18} /> : <ChevronRight size={18} />)}
        {content}
      </div>

      {open && hasChildren && (
        <div
          style={{
            marginLeft: '20px',
            paddingLeft: '12px',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
