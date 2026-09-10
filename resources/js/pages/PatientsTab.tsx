import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import './Admin.css';



export default function PatientsTab ({ currentUser, query }) {

    const { showNotification } = useNotification();
    const { t } = useTranslation();
    const NameRenderer = ({ data }) => {
        return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            {`${data?.first_name || ''} ${data?.last_name || ''}`.trim()}
        </span>
        );
    };


    return(
        <> 
        <ServerGrid 
            columns={[
                { field: 'name', displayName: t('table.name') },
                { field: 'Remarks', displayName: t('table.remarks') },
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
            />
        
        </>
    )
}

function PatientsForm({ data, setData }) {
  const { t } = useTranslation();
  const getValue = (field) => (data && data[field]) || '';
  const handleChange = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="add-user-form">
      <div className="add-user-form-grid">
        <div>
          <label className="form-label">{t('patients.form.firstName')}</label>
          <input type="text" className="form-input" value={getValue('first_name')} onChange={handleChange('first_name')} />
        </div>
        <div>
          <label className="form-label">{t('patients.form.lastName')}</label>
          <input type="text" className="form-input" value={getValue('last_name')} onChange={handleChange('last_name')} />
        </div>
        <div>
          <label className="form-label">{t('patients.form.socialId')}</label>
          <input type="text" className="form-input" value={getValue('social_id')} onChange={handleChange('social_id')} />
        </div>
        <div>
          <label className="form-label">{t('patients.form.reform')}</label>
          <input type="text" className="form-input" value={getValue('reform')} onChange={handleChange('reform')} />
        </div>

      </div>
  </div>
    )
}
