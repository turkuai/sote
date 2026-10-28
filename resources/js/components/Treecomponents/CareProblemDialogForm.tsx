import { ArrowLeft } from 'lucide-react';
import SelectCategoryTree from './SelectCategoryTree';

function CareProblemDialogForm({ categories, steps, activeStep, onBack, data, setData }) {
  return (
    <>
      <div>
        <button
          disabled={activeStep == 0}
          onClick={() => onBack()}
          className="inline-flex size-6 items-center justify-center rounded-lg border-0 bg-blue-600! text-lg text-white p-1! mb-4! hover:bg-blue-700! ml-auto!"
        >
          <ArrowLeft />
        </button>
        <div>{steps[activeStep]}</div>

        {/** select categories */}
        {activeStep == 0 && <SelectCategoryTree categories={categories} setNewData={setData} />}

        {/** add a description */}
        {activeStep == 1 && <textarea rows={4} value={data.description} onChange={(event) => setData(event.target.value)} />}

        {/** review & save */}
        {activeStep == 2 && (
          <>
            <textarea disabled rows={4} value={data.description} onChange={(event) => setData({ ...data, description: event.target.value })} />
          </>
        )}
      </div>
    </>
  );
}

export default CareProblemDialogForm;
