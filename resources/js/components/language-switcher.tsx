import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageSwitcherProps = {
    className?: string;
};

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
    const { i18n, t } = useTranslation();
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

    const handleLanguageChange = (language: 'en' | 'fi' | 'sv') => {
        i18n.changeLanguage(language);
        setIsOpen(false);
    };

    const currentLabel = currentLanguage === 'fi' ? t('common.finnish') : currentLanguage === 'sv' ? t('common.swedish') : t('common.english');

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
                        <button type="button" className="dropdown-menu-item" onClick={() => handleLanguageChange('en')}>
                            {t('common.english')}
                        </button>
                        <button type="button" className="dropdown-menu-item" onClick={() => handleLanguageChange('fi')}>
                            {t('common.finnish')}
                        </button>

                        <button type="button" className="dropdown-menu-item" onClick={() => handleLanguageChange('sv')}>
                            {t('common.swedish')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
