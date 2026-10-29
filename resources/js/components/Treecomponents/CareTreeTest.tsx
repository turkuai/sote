import { useTranslation } from 'react-i18next';
import { CareTree } from './CareTree';

export function CareTreeTest() {
  const { t } = useTranslation();

  return (
    <div>
      <div style={{ fontSize: '20px', fontWeight: '700', textAlign: 'left' }}>{t('caretree.care_need')}</div>
      <CareTree
        data={{
          category: [
            'Erittäminen - ruuansulatukseen, virtsateiden toimintaan, verenvuotoon ja muuhun erittämiseen liittyvät osatekijät',
            'Ulostamiseen liittyvä häiriö',
            'Ummetus',
          ],

          id: 12,
          category_id: 3,
          user: 'Hoitaja A',
          patient_id: 99,
          description: 'Vatsa ei ole toiminut kahteen päivään...',
          creation_at: '06:20',

          planItems: [
            {
              id: 1,
              problem_id: 12,
              description: 'Lorem ipsum dolor sit amet',
              user_name: 'Hoitaja A',
              created_at: '08:20',
              type: 'goal',
            },
            {
              id: 2,
              problem_id: 12,
              description: 'Lorem ipsum dolor sit amet',
              user_name: 'Hoitaja A',
              created_at: '08:20',
              type: 'goal',
            },
            {
              id: 3,
              problem_id: 12,
              description: 'Lorem ipsum dolor sit amet',
              user_name: 'Hoitaja A',
              created_at: '08:20',
              type: 'activity',
            },
            {
              id: 4,
              problem_id: 12,
              description: 'Fusce non tellus ac lectus',
              user_name: 'Hoitaja B',
              created_at: '05:34',
              type: 'activity',
            },
            {
              id: 5,
              problem_id: 12,
              description: 'Lorem ipsum dolor sit amet',
              user_name: 'Hoitaja A',
              created_at: '12:45',
              type: 'review',
            },
          ],
        }}
      />
    </div>
  );
}
