import { CareProblem } from '@/types/caretree';
import { Plus } from 'lucide-react';
import { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGridEditDialog } from 'tai-grid';
import CareProblemDialogForm from './CareProblemDialogForm';
import { CareTree } from './CareTree';
import { dummyCategories } from './DialogComponents/dialogTest';

//types
type CareTreeListProps = {
  careDataList: CareProblem[];
};

type State = {
  data: CareProblem[];
  activeStep: number;
};

type Action =
  | {
      type: 'save';
      data: CareProblem;
    }
  | {
      type: 'next' | 'back' | 'reset';
    };

//functionality for adding a new care problem
function reducer(state: State, action: Action) {
  const { type } = action;
  switch (type) {
    // saves the new data
    case 'save': {
      return { data: [...state.data, action.data], activeStep: state.activeStep };
    }

    //increases the step by 1
    case 'next': {
      return { ...state, activeStep: Math.min(state.activeStep + 1, 2) };
    }

    //decreases the step by 1
    case 'back': {
      return { ...state, activeStep: Math.max(0, state.activeStep - 1) };
    }

    //reset the step
    case 'reset': {
      return { ...state, activeStep: 0 };
    }
  }
}

function CareTreeList({ careDataList }: CareTreeListProps) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, { data: careDataList, activeStep: 0 });

  //variables related to the dialog
  const [isCareProblemDialogOpen, setIsCareProblemDialogOpen] = useState(false);
  const steps = ['Select Category', 'Enter a Description', 'Review & Save'];

  //tracks nurses entry + nurse & patient info
  const [newData, setNewData] = useState<CareProblem>({
    category: [],
    id: 11,
    category_id: 3,
    user: 'Hoitaja A',
    patient_id: 99,
    description: '',
    creation_at: '06:20',
    planItems: [],
  });

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setIsCareProblemDialogOpen(true)}
          type="button"
          className="inline-flex size-6 items-center justify-center rounded-lg border-0 bg-red-600 text-lg text-white p-1! mb-4! hover:bg-red-700 ml-auto!"
        >
          <Plus />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {state.data?.map((data) => (
          <div key={data.id} className="rounded-lg border border-gray-200 bg-white shadow-sm p-4">
            <div className="text-xl font-bold mb-1">{t('caretree.care_need')}</div>
            <CareTree data={data} />
          </div>
        ))}
      </div>

      {/* ---- CareProblemDialog ---- */}
      {isCareProblemDialogOpen && (
        <ServerGridEditDialog
          formComponent={
            <CareProblemDialogForm
              categories={dummyCategories}
              steps={steps}
              activeStep={state.activeStep}
              onBack={() => dispatch({ type: 'back' })}
              data={newData}
              setData={setNewData}
            />
          }
          onCancel={() => {
            dispatch({ type: 'reset' });
            setIsCareProblemDialogOpen(false);
          }}
          onSave={() => {
            if (state.activeStep == 2) {
              dispatch({ data: newData, type: 'save' });
              setIsCareProblemDialogOpen(false);
            } else {
              dispatch({ type: 'next' });
            }
          }}
          labels={{ title: 'Add Care Problems', save: state.activeStep == 2 ? 'Save' : 'Next' }}
        />
      )}
    </>
  );
}

export default CareTreeList;
