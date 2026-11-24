import { useTranslation } from 'react-i18next';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <header className="app-header">
      <div className="page-header">
        <h2>{t(title)}</h2>
      </div>
    </header>
  );
}
