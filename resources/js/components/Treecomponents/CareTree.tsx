import { FinalData } from '@/types/caretree';
import { Dot } from 'lucide-react';
import { ItemTree } from './ItemTree';
import Tree from './Tree';

interface CareTreeProps {
  data: FinalData;
}

export function CareTree({ data }: CareTreeProps) {
  const labels = data.category.map((line) => line);

  return (
    <Tree>
      {/* Hoidontarve hierarchy */}
      <ItemTree content={labels[0]} contentStyle={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
        <ItemTree content={labels[1]} contentStyle={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
          <ItemTree content={labels[2]} contentStyle={{ background: '#fafafa', borderBottom: '1px solid #e5e5e5' }}>
            <ItemTree
              content={
                <div>
                  <div style={{ fontSize: '14px', color: '#444' }}>
                    {data.description.description}
                    <span style={{ fontSize: '12px', color: '#777', marginLeft: '8px' }}>
                      {data.description.creation_at} | {data.description.user}
                    </span>
                  </div>
                </div>
              }
              contentStyle={{ borderBottom: '1px solid #e5e5e5', background: '#fff', padding: '6px' }}
            />
          </ItemTree>
        </ItemTree>
      </ItemTree>

      <ItemTree
        content="Hoidon arviointi"
        contentStyle={{
          fontWeight: 700,
          fontSize: '18px',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        {data.hoitotavoite
          .filter((item) => item.type === 0)
          .map((item) => (
            <ItemTree
              key={item.id}
              content={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {/* Bullet icon */}
                  <Dot size={18} />

                  {/* Text block */}
                  <div>
                    <div style={{ fontSize: '14px', color: '#444' }}>
                      {item.description}
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#777',
                          marginLeft: '8px',
                        }}
                      >
                        {item.created_at} | {item.user}
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
      </ItemTree>

      <ItemTree
        content="Hoidon arviointi"
        contentStyle={{
          fontWeight: 700,
          fontSize: '18px',
          marginLeft: '40px',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        {data.hoitotavoite
          .filter((item) => item.type === 1)
          .map((item) => (
            <ItemTree
              key={item.id}
              content={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: '40px',
                  }}
                >
                  {/* Bullet icon */}
                  <Dot size={18} />

                  {/* Text block */}
                  <div>
                    <div style={{ fontSize: '14px', color: '#444' }}>
                      {item.description}
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#777',
                          marginLeft: '8px',
                        }}
                      >
                        {item.created_at} | {item.user}
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
      </ItemTree>

      <ItemTree
        content="Hoidon arviointi"
        contentStyle={{
          fontWeight: 700,
          fontSize: '18px',
          marginLeft: '40px',
          borderBottom: '1px solid #e5e5e5',
        }}
      >
        {data.hoitotavoite
          .filter((item) => item.type === 2)
          .map((item) => (
            <ItemTree
              key={item.id}
              content={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginLeft: '40px',
                  }}
                >
                  {/* Bullet icon */}
                  <Dot size={18} />

                  {/* Text block */}
                  <div>
                    <div style={{ fontSize: '14px', color: '#444' }}>
                      {item.description}
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#777',
                          marginLeft: '8px',
                        }}
                      >
                        {item.created_at} | {item.user}
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
      </ItemTree>
    </Tree>
  );
}
