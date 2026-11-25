import { CareCategory, CareProblem } from '@/types/caretree';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type SelectSubCategoriesProps = {
  categories: CareCategory[];
  parent_category_id: number;
  setNewData: Dispatch<SetStateAction<CareProblem>>;
};

function SelectSubCategories({ categories, parent_category_id, setNewData }: SelectSubCategoriesProps) {
  //filter the categories buy their parent categories
  const children = categories.filter((c) => c.parent_category_id == parent_category_id);
  const [selectedId, setSelectedId] = useState<null | number>(null);

  useEffect(() => {
    const path = [];
    if (selectedId == null) return;
    let current = categories.find((c) => c.id == selectedId);
    while (current) {
      path.unshift(current.name);
      if (current.parent_category_id == null) break;
      current = categories.find((c) => c.id == current.parent_category_id);
    }
    setNewData((prevV) => ({ ...prevV, category: [...path], category_id: selectedId }));
  }, [selectedId, categories, setNewData]);

  return (
    <div className="ml-5">
      {children.map((c) => (
        <div key={c.id}>
          <div className="my-1 p-[5px] flex items-center gap-2 hover:bg-blue-50">
            <input
              type="radio"
              name={parent_category_id.toString()}
              onChange={() => setSelectedId(c.id)}
              value={c.id}
              checked={selectedId === c.id}
            />
            {c.name}
          </div>
          {selectedId == c.id && <SelectSubCategories categories={categories} parent_category_id={c.id} setNewData={setNewData} />}
        </div>
      ))}
    </div>
  );
}

export default SelectSubCategories;
