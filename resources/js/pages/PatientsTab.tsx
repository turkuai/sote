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
            showAddButton={true}
            showNot={showNotification}
            getApiBase={getApiBase}
            />
        
        </>
    )
}
