import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageSwitcherProps = {
  className?: string;
};

const languageNames = {
  fi: 'Suomi',
  sv: 'Svenska',
  en: 'English',
  ee: 'Eesti',
} as const;

type SupportedLanguage = keyof typeof languageNames;

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentLanguage = i18n.language.split('-')[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (language: SupportedLanguage) => {
    i18n.changeLanguage(language);
    setIsOpen(false);
  };

  const currentLabel = languageNames[currentLanguage as SupportedLanguage] ?? languageNames.fi;

  return (
    <div className={className}>
      <div className="user-dropdown-container" ref={containerRef}>
        <button
          type="button"
          className="user-dropdown-trigger"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <span className="user-info-text">
            <strong>{currentLabel}</strong>
          </span>
          <ChevronDown size={16} className={`dropdown-icon ${isOpen ? 'open' : ''}`} />
        </button>

        {isOpen && (
          <div className="user-dropdown-menu">
            {(Object.keys(languageNames) as SupportedLanguage[]).map((language) => (
              <button key={language} type="button" className="dropdown-menu-item" onClick={() => handleLanguageChange(language)}>
                {languageNames[language]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
