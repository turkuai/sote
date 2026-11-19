import { loadCareCategories, saveCareProblem } from '@/api/care';
import type { CareCategory, CareProblem } from '@/types/caretree';
import { useReducer, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServerGridEditDialog } from 'tai-grid';
import AddItemButton from '../AddItemButton';
import CareProblemDialogForm from './CareProblemDialogForm';
import { CareTree } from './CareTree';
//import { dummyCategories } from './dialogTest';

//types
type CareTreeListProps = {
  patientId: string;
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

function CareTreeList({ patientId, careDataList }: CareTreeListProps) {
  const { t } = useTranslation();
  const [state, dispatch] = useReducer(reducer, { data: careDataList });

  //variables related to the dialog
  const [isCareProblemDialogOpen, setIsCareProblemDialogOpen] = useState(false);
  const steps = ['Select Category', 'Enter a Description', 'Review & Save'];
  const [activeStep, setActiveStep] = useState<number>(0);

  const [categories, setCategories] = useState<CareCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  //tracks nurses entry + nurse & patient info
  const [newData, setNewData] = useState<CareProblem>({
    category: [],
    id: 11,
    category_id: 3,
    user: 'Hoitaja A',
    patient_id: Number(patientId),
    description: '',
    creation_at: '06:20',
    planItems: [],
  });

  async function openCareProblemDialog() {
    if (isLoadingCategories) return;

    setIsLoadingCategories(true);
    setCategoryError('');

    try {
      const loadedCategories = await loadCareCategories();
      setCategories(loadedCategories);
      setIsCareProblemDialogOpen(true);
    } catch (error) {
      setCategoryError(error instanceof Error ? error.message : 'Could not load care categories.');
    } finally {
      setIsLoadingCategories(false);
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <AddItemButton label="open-care-dialog" onClick={openCareProblemDialog} />
      </div>
      {isLoadingCategories && <p role="status">Loading care categories…</p>}
      {categoryError && <p role="alert">{categoryError}</p>}

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
            <>
              <CareProblemDialogForm
                categories={categories}
                steps={steps}
                activeStep={activeStep}
                onBack={() => setActiveStep((prevV) => Math.max(0, prevV - 1))}
                data={newData}
                setData={setNewData}
              />
              {saveError && <p role="alert">{saveError}</p>}
            </>
          }
          onCancel={() => {
            if (isSaving) return;
            setSaveError('');
            setNewData((previous) => ({ ...previous, category: [], description: '' }));
            setActiveStep(0);
            setIsCareProblemDialogOpen(false);
          }}
          onSave={async () => {
            if (isSaving) return;
            setSaveError('');

            if (activeStep < 2) {
              setActiveStep((step) => step + 1);
              return;
            }

            const description = newData.description.trim();

            if (newData.category.length === 0 || !description) {
              setSaveError('Choose a category and enter a description before saving.');
              return;
            }

            setIsSaving(true);

            try {
              const savedProblem = await saveCareProblem(newData.patient_id, newData.category_id, description, newData.category);

              dispatch({ data: savedProblem });
              setNewData((previous) => ({ ...previous, category: [], description: '' }));
              setActiveStep(0);
              setIsCareProblemDialogOpen(false);
            } catch (error) {
              setSaveError(error instanceof Error ? error.message : 'Could not save the care need.');
            } finally {
              setIsSaving(false);
            }
          }}
          labels={{ title: 'Add Care Problems', save: activeStep === 2 ? 'Save' : 'Next' }}
        />
      )}
    </>
  );
}

export default CareTreeList;
