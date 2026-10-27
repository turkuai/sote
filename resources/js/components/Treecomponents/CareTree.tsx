import type { CareProblem } from '@/types/caretree';
import { Dot, Plus } from 'lucide-react';
import { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ServerGridEditDialog from '../../../../grid/src/ServerGridEditDialog';
import DescriptionForm from './DescriptionForm';
import Tree from './Tree';
import { TreeItem } from './TreeItem';
import { buildCategoryTree } from './buildCategoryTree';

interface CareTreeProps {
  data: CareProblem;
}

type CareTreeAction = {
  type: 'addItem';
  item: CareProblem['planItems'][number];
};

function careTreeReducer(state: CareProblem, action: CareTreeAction): CareProblem {
  switch (action.type) {
    case 'addItem':
      return {
        ...state,
        planItems: [...state.planItems, action.item],
      };
    default:
      return state;
  }
}

export function CareTree({ data: initialData }: CareTreeProps) {
  const { t } = useTranslation();
  const [data, dispatch] = useReducer(careTreeReducer, initialData);

  const [selectedType, setSelectedType] = useState<CareProblem['planItems'][number]['type'] | null>(null);

  const [description, setDescription] = useState('');
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

  function closeDialog() {
    setSelectedType(null);
    setDescription('');
  }

  function saveDescription() {
    const text = description.trim();

    if (!selectedType || !text) {
      return;
    }

    dispatch({
      type: 'addItem',
      item: {
        id: Math.max(0, ...data.planItems.map((item) => item.id)) + 1,
        problem_id: data.id,
        description: text,
        user_name: 'Demo',
        created_at: new Date().toLocaleTimeString('fi-FI', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: selectedType,
      },
    });

    closeDialog();
  }

  return (
    <>
      <Tree>
        {categoryTree}

        {/* GOALS */}
        <TreeItem
          content={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{t('caretree.goal')}</span>
              <button
                type="button"
                aria-label={`Lisää: ${t('caretree.goal')}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setDescription('');
                  setSelectedType('goal');
                }}
                style={{
                  display: 'inline-flex',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: 'inherit',
                }}
              >
                <Plus size={20} />
              </button>
            </div>
          }
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
          content={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{t('caretree.activity')}</span>
              <button
                type="button"
                aria-label={`Lisää: ${t('caretree.activity')}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setDescription('');
                  setSelectedType('activity');
                }}
                style={{
                  display: 'inline-flex',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: 'inherit',
                }}
              >
                <Plus size={20} />
              </button>
            </div>
          }
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
          content={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>{t('caretree.review')}</span>
              <button
                type="button"
                aria-label={`Lisää: ${t('caretree.review')}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setDescription('');
                  setSelectedType('review');
                }}
                style={{
                  display: 'inline-flex',
                  background: 'none',
                  border: 'none',
                  padding: '4px',
                  cursor: 'pointer',
                  color: 'inherit',
                }}
              >
                <Plus size={20} />
              </button>
            </div>
          }
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

      {selectedType !== null && (
        <ServerGridEditDialog
          formComponent={<DescriptionForm description={description} onDescriptionChange={setDescription} />}
          onCancel={closeDialog}
          onSave={saveDescription}
        />
      )}
    </>
  );
}
