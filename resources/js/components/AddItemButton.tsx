import { Plus } from 'lucide-react';

interface AddItemButtonProps {
  label: string;
  onClick: () => void;
}

export default function AddItemButton({ label, onClick }: AddItemButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="server-grid-add-button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      <Plus size={20} />
    </button>
  );
}
