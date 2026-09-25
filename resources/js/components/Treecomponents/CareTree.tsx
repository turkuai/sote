import { FinalData } from '@/types/caretree';
import { Dot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Tree from './Tree';
import { TreeItem } from './TreeItem';
import { buildCategoryTree } from './buildCategoryTree';

interface CareTreeProps {
  data: FinalData;
}

export function CareTree({ data }: CareTreeProps) {
  const { t } = useTranslation();

  const labels = data.category.map((line) => line);

  const descriptionNode = (
    <TreeItem
      content={
        <div>
          <div style={{ fontSize: '14px', color: '#444' }}>
            {data.description}
            <span style={{ fontSize: '12px', color: '#777', marginLeft: '8px' }}>
              {data.creation_at} | {data.user}
            </span>
          </div>
        </div>
      }
      contentStyle={{ borderBottom: '1px solid #e5e5e5', background: '#fff', padding: '6px' }}
    />
  );

  const categoryTree = buildCategoryTree(labels, descriptionNode);

  return (
    <Tree>
      {categoryTree}

      {/* GOALS */}
      <TreeItem
        content={t('caretree.goal')}
        contentStyle={{
          fontWeight: 700,
          fontSize: '18px',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        {data.planItems
          .filter((item) => item.type === 'goal')
          .map((item) => (
            <TreeItem
              key={item.id}
              content={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Dot size={18} />
                  <div>
                    <div style={{ fontSize: '14px', color: '#444' }}>
                      {item.description}
                      <span style={{ fontSize: '12px', color: '#777', marginLeft: '8px' }}>
                        {item.created_at} | {item.user_name}
                      </span>
                    </div>
                  </div>
                </div>
              }
              contentStyle={{
                borderBottom: '1px solid #e5e5e5',
                background: '#fafafa',
                padding: '6px',
              }}
            />
          ))}
      </TreeItem>

      {/* ACTIVITIES */}
      <TreeItem
        content={t('caretree.activity')}
        contentStyle={{
          fontWeight: 700,
          fontSize: '18px',
          marginLeft: '40px',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        {data.planItems
          .filter((item) => item.type === 'activity')
          .map((item) => (
            <TreeItem
              key={item.id}
              content={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '40px' }}>
                  <Dot size={18} />
                  <div>
                    <div style={{ fontSize: '14px', color: '#444' }}>
                      {item.description}
                      <span style={{ fontSize: '12px', color: '#777', marginLeft: '8px' }}>
                        {item.created_at} | {item.user_name}
                      </span>
                    </div>
                  </div>
                </div>
              }
              contentStyle={{
                borderBottom: '1px solid #e5e5e5',
                background: '#fafafa',
                padding: '6px',
              }}
            />
          ))}
      </TreeItem>

      {/* REVIEW */}
      <TreeItem
        content={t('caretree.review')}
        contentStyle={{
          fontWeight: 700,
          fontSize: '18px',
          marginLeft: '40px',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        {data.planItems
          .filter((item) => item.type === 'review')
          .map((item) => (
            <TreeItem
              key={item.id}
              content={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '40px' }}>
                  <Dot size={18} />
                  <div>
                    <div style={{ fontSize: '14px', color: '#444' }}>
                      {item.description}
                      <span style={{ fontSize: '12px', color: '#777', marginLeft: '8px' }}>
                        {item.created_at} | {item.user_name}
                      </span>
                    </div>
                  </div>
                </div>
              }
              contentStyle={{
                borderBottom: '1px solid #e5e5e5',
                background: '#fafafa',
                padding: '6px',
              }}
            />
          ))}
      </TreeItem>
    </Tree>
  );
}
