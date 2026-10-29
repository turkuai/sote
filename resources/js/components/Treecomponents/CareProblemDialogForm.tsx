import { ArrowLeft } from 'lucide-react';
import SelectCategoryTree from './SelectCategoryTree';

function CareProblemDialogForm({ categories, steps, activeStep, onBack, data, setData }) {
  return (
    <div>
      <div className="flex gap-2">
        <button
          disabled={activeStep == 0}
          onClick={() => onBack()}
          className="mb-4 flex size-6 shrink-0 items-center justify-center bg-transparent! rounded-lg text-black! hover:bg-blue-100!"
        >
          <ArrowLeft className="size-5 shrink-0" />
        </button>
        <p className="text-xl font-bold">{steps[activeStep]}</p>
      </div>

      <div className="border-2 rounded-md p-2 my-2">
        {/** select categories */}
        {activeStep == 0 && <SelectCategoryTree categories={categories} setNewData={setData} />}

        {/** add a description */}
        {activeStep == 1 && (
          <textarea
            className="w-full outline-none"
            rows={4}
            value={data.description}
            onChange={(event) => setData({ ...data, description: event.target.value })}
          />
        )}

        {/** review & save */}
        {activeStep === 2 && (
          <div className="flex flex-col gap-5">
            <section>
              <h3 className="mb-2! text-sm font-semibold text-gray-500">Selected category</h3>

              <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3!">
                {data.category.map((c: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    {i > 0 && <span>→</span>}

                    <span className={i === data.category.length - 1 ? 'font-semibold text-red-700' : 'text-gray-700'}>{c}</span>
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2! text-sm font-semibold text-gray-500">Problem description</h3>

              <p className="min-h-24 rounded-lg border border-gray-200 bg-white p-3! text-sm leading-6 whitespace-pre-wrap break-words text-gray-800">
                {data.description}
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

export default CareProblemDialogForm;
