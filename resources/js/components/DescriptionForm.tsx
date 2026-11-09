import { useId } from 'react';

interface DescriptionFormProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export default function DescriptionForm({ description, onDescriptionChange }: DescriptionFormProps) {
  const inputId = useId();

  return (
    <div>
      <label htmlFor={inputId}>Kuvaus</label>
      <textarea
        id={inputId}
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        rows={4}
        autoFocus
        style={{
          display: 'block',
          width: '100%',
          marginTop: '8px',
          padding: '8px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          font: 'inherit',
        }}
      />
    </div>
  );
}
