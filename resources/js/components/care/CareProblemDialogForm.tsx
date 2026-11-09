import { ArrowLeft } from 'lucide-react';
import ReviewEntries from './ReviewEntries';
import SelectCategoryTree from './SelectCategoryTree';

function CareProblemDialogForm({ categories, steps, activeStep, onBack, data, setData }) {
  return (
    <div>
      <div className="flex gap-2">
        <button
          disabled={activeStep === 0}
          onClick={() => onBack()}
          className="mb-4 flex size-6 shrink-0 items-center justify-center bg-transparent! rounded-lg text-black! hover:bg-blue-100!"
        >
          <ArrowLeft className="size-5 shrink-0" />
        </button>
        <p className="text-xl font-bold">{steps[activeStep]}</p>
      </div>

      <div className="border-2 rounded-md p-2 my-2">
        {/** select categories */}
        {activeStep === 0 && <SelectCategoryTree categories={categories} setNewData={setData} />}

        {/** add a description */}
        {activeStep === 1 && (
          <textarea
            className="w-full outline-none"
            rows={4}
            value={data.description}
            onChange={(event) => setData({ ...data, description: event.target.value })}
          />
        )}

        {/** review & save */}
        {activeStep === 2 && <ReviewEntries data={data} />}
      </div>
    </div>
  );
}

export default CareProblemDialogForm;
