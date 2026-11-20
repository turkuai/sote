import { useId } from 'react';
import { useTranslation } from 'react-i18next';

interface DescriptionFormProps {
  description: string;
  onDescriptionChange: (value: string) => void;
}

export default function DescriptionForm({ description, onDescriptionChange }: DescriptionFormProps) {
  const inputId = useId();

  const { t } = useTranslation();

  return (
    <div>
      {}
      <label htmlFor={inputId}>{t('caretree.description')}</label>
      {}

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
