import { CareProblem } from '@/types/caretree';
import { Plus } from 'lucide-react';
import { useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { CareTree } from './CareTree';

//types
type CareTreeListProps = {
  CareDataList: CareProblem[];
};

type Action = {
  data: CareProblem;
};

//functionality for adding a new care problem
function reducer(state: CareProblem[], action: Action): CareProblem[] {
  const { data } = action;
  return [...state, data];
}

function CareTreeList({ CareDataList }: CareTreeListProps) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, CareDataList);

  // the dummy data
  const nextId = Math.max(0, ...state.map((problem) => problem.id)) + 1;
  const newdata: CareProblem = {
    category: [
      'Erittäminen - ruuansulatukseen, virtsateiden toimintaan, verenvuotoon ja muuhun erittämiseen liittyvät osatekijät',
      'Ulostamiseen liittyvä häiriö',
      'Ummetus',
    ],

    id: nextId,
    category_id: 3,
    user: 'Hoitaja A',
    patient_id: 99,
    description: 'Vatsa ei ole toiminut kahteen päivään...',
    creation_at: '06:20',

    planItems: [],
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => dispatch({ data: newdata })}
          type="button"
          className="inline-flex size-6 items-center justify-center rounded-lg border-0 bg-red-600 text-lg text-white p-1! mb-4! hover:bg-red-700 ml-auto!"
        >
          <Plus />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {state.map((data) => (
          <div key={data.id} className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
            <div className="text-xl font-bold mb-1">{t('caretree.care_need')}</div>
            <CareTree data={data} />
          </div>
        ))}
      </div>
    </>
  );
}

export default CareTreeList;
