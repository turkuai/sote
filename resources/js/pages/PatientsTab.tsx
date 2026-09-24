import { useTranslation } from 'react-i18next';
import { ServerGrid } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import { getApiBase } from '../config';
import FieldValidationError from '../components/FieldValidationError';
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
            showAddButton={true}
            formComponent={PatientForm}
            showNot={showNotification}
            getApiBase={getApiBase}
            />
        
        </>
    )
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
