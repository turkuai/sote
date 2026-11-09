import { CareCategory, CareProblem } from '@/types/caretree';
import { Dispatch, SetStateAction, useState } from 'react';
import SelectSubCategories from './SelectSubCategories';

type SelectCategoryTreeProps = {
  categories: CareCategory[];
  setNewData: Dispatch<SetStateAction<CareProblem>>;
};

function SelectCategoryTree({ categories, setNewData }: SelectCategoryTreeProps) {
  const rootCategories = categories.filter((c) => c.parent_category_id == null);
  const [selectedId, setSelectedId] = useState<null | number>(null);
  return (
    <div>
      {rootCategories.map((c) => (
        <div key={c.id}>
          <div className="my-1 p-[5px] flex items-center gap-2 hover:bg-blue-50">
            <input
              type="radio"
              name="main"
              onChange={() => {
                setSelectedId(c.id);
                setNewData((prevV: CareProblem) => ({ ...prevV, category: [c.name], category_id: c.id }));
              }}
              value={c.id}
              checked={selectedId === c.id}
            />
            {c.name}
          </div>
          {selectedId === c.id && <SelectSubCategories categories={categories} parent_category_id={c.id} setNewData={setNewData} />}
        </div>
      ))}
    </div>
  );
}

export default SelectCategoryTree;
