import { CareProblem } from '@/types/caretree';
import { Plus } from 'lucide-react';
import { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGridEditDialog } from 'tai-grid';
import CareProblemDialogForm from './CareProblemDialogForm';
import { CareTree } from './CareTree';
import { dummyCategories } from './careDialogComponents/dialogTest';

//types
type CareTreeListProps = {
  careDataList: CareProblem[];
};

type State = {
  data: CareProblem[];
};
type Action = {
  data: CareProblem;
};

//functionality for adding a new care problem
function reducer(state: State, action: Action) {
  return { data: [...state.data, action.data] };
}

function CareTreeList({ careDataList }: CareTreeListProps) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, { data: careDataList });

  //variables related to the dialog
  const [isCareProblemDialogOpen, setIsCareProblemDialogOpen] = useState(false);
  const steps = ['Select Category', 'Enter a Description', 'Review & Save'];
  const [activeStep, setActiveStep] = useState<number>(0);

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
        <button type="button" className="server-grid-add-button" onClick={() => setIsCareProblemDialogOpen(true)}>
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-3!">
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
              activeStep={activeStep}
              onBack={() => setActiveStep((prevV) => Math.max(0, prevV - 1))}
              data={newData}
              setData={setNewData}
            />
          }
          onCancel={() => {
            setActiveStep(0);
            setIsCareProblemDialogOpen(false);
          }}
          onSave={() => {
            if (activeStep === 2) {
              dispatch({ data: newData });
              setIsCareProblemDialogOpen(false);

              //resets selection
              setNewData({ ...newData, category: [], description: '' });
              setActiveStep(0);
            } else {
              setActiveStep((prevV) => Math.min(2, prevV + 1));
            }
          }}
          labels={{ title: 'Add Care Problems', save: activeStep === 2 ? 'Save' : 'Next' }}
        />
      )}
    </>
  );
}

export default CareTreeList;
