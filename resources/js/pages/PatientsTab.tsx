import { useServerGridLabels } from '@/hooks/useCurrentLanguage';
import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import FieldValidationError from '../components/FieldValidationError';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';

export default function PatientsTab({ currentUser, query }) {
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const NameRenderer = ({ data }) => {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
        {`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}
      </span>
    );
  };

  return (
    <>
      <ServerGrid
        columns={[
          { field: 'name', displayName: t('table.name') },
          { field: 'remarks', displayName: t('table.remarks') },
        ]}
        columnRenderers={{
          name: NameRenderer,
        }}
        path="patients"
        allowEditing={currentUser?.role_type === 'admin'}
        allowDelete={currentUser?.role_type === 'admin'}
        pageSize={10}
        query={query}
        formComponent={PatientsForm}
        showAddButton={true}
        showNot={showNotification}
        getApiBase={getApiBase}
        labels={useServerGridLabels()}
      />
    </>
  );
}

function PatientsForm({ data, setData }) {
  const { t } = useTranslation();
  const getValue = (field) => (data && data[field]) || '';
  const handleChange = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="add-user-form">
      <div className="add-user-form-grid">
        <div>
          <label className="form-label">{t('table.form.firstName')}</label>
          <input type="text" className="form-input" value={getValue('first_name')} onChange={handleChange('first_name')} />
        </div>
        <div>
          <label className="form-label">{t('table.form.lastName')}</label>
          <input type="text" className="form-input" value={getValue('last_name')} onChange={handleChange('last_name')} />
        </div>
        <div>
          <label className="form-label">{t('table.form.socialId')}</label>
          <input type="text" className="form-input" value={getValue('social_id')} onChange={handleChange('social_id')} />
        </div>
        <div>
          <label className="form-label">{t('table.form.remarks')}</label>
          <input type="text" className="form-input" value={getValue('remarks')} onChange={handleChange('remarks')} />
        </div>
      </div>
    </div>
  );
}

function PatientForm({ data, setData, errors }) {
    const value = (field) => String(data?.[field] ?? '');
    const change = (field) => (event) => setData((previous) => ({ ...previous, [field]: event.target.value }));

    return (
        <div className="add-user-form">
            <div className="add-user-form-grid">
                <div>
                    <label className="form-label">First name</label>
                    <input className="form-input" type="text" value={value('first_name')} onChange={change('first_name')} />
                    <FieldValidationError errors={errors} field="first_name" />
                </div>
                <div>
                    <label className="form-label">Last name</label>
                    <input className="form-input" type="text" value={value('last_name')} onChange={change('last_name')} />
                    <FieldValidationError errors={errors} field="last_name" />
                </div>
                <div>
                    <label className="form-label">Social ID</label>
                    <input className="form-input" type="text" value={value('social_id')} onChange={change('social_id')} />
                    <FieldValidationError errors={errors} field="social_id" />
                </div>
            </div>
        </div>
    );
}
