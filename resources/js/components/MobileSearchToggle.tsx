import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

const MobileSearchToggle = ({ value, onChange, placeholder }) => {
  const { t } = useTranslation();
  const defaultPlaceholder = placeholder ?? t('search.placeholder');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  if (open) {
    return (
      <div className="mobile-search-bar">
        <input
          ref={inputRef}
          type="search"
          autoComplete="off"
          placeholder={defaultPlaceholder}
          value={value}
          onChange={onChange}
        />
        <button onClick={() => { setOpen(false); onChange({ target: { value: '' } }); }} aria-label={t('search.close')}>
          <X size={18} />
        </button>
      </div>
    );
  }

  return (
    <button className="mobile-search-toggle" onClick={() => setOpen(true)} aria-label={t('search.open')}>
      <Search size={18} />
    </button>
  );
};

export default MobileSearchToggle;

