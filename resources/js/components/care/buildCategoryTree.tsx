import { ReactNode } from 'react';
import { TreeItem } from '../tree/TreeItem';

export function buildCategoryTree(labels: string[], descriptionNode: ReactNode) {
  return labels.reduceRight((child, label) => {
    return (
      <TreeItem content={label} contentStyle={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
        {child}
      </TreeItem>
    );
  }, descriptionNode);
}
