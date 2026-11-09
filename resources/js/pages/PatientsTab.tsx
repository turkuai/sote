import { useServerGridLabels } from '@/hooks/useCurrentLanguage';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldValidationError, ServerGrid as ServerGridBase } from 'tai-grid';
import 'tai-grid/style.css';
import { useNotification } from '../components/NotificationContext';
import PatientGroupsModal from '../components/PatientGroupsModal';
import { getApiBase } from '../config';
import './Admin.css';

const ServerGrid = ServerGridBase as React.ComponentType<any>;

type Patient = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  social_id?: string;
  remarks?: string;
};

type PatientGroup = {
  id: number | string;
  name?: string;
  access_key?: string;
};

type PatientsTabProps = {
  currentUser: any;
  query?: string;
};

export default function PatientsTab({ currentUser, query }: PatientsTabProps) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const gridLabels = useServerGridLabels();

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const [showGroupModal, setShowGroupModal] = useState(false);

  const [groupRefreshKey, setGroupRefreshKey] = useState(0);

  const isAdmin = currentUser?.role_type === 'admin';
  const isManager = currentUser?.role_type === 'manager';

  const canManagePatients = isAdmin || isManager;

  const handlePatientRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setGroupRefreshKey((value) => value + 1);
  };

  const NameCell = ({ value }: { value: unknown }) => {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        {value != null ? String(value) : ''}
      </span>
    );
  };

  const patientName = selectedPatient ? `${selectedPatient.first_name || ''} ${selectedPatient.last_name || ''}`.trim() : '';

  return (
    <>
      <div className="hide-on-mobile">
        <div
          style={{
            display: 'flex',
            gap: 0,
            alignItems: 'flex-start',
          }}
        >
          {/*
              LEFT: PATIENTS
           */}
          <div
            style={{
              flex: '0 0 50%',
              minWidth: 0,
              paddingRight: '1.5rem',
            }}
          >
            <div className="tab-header">
              <h2>{t('patients.managementTitle')}</h2>
            </div>

            <ServerGrid
              columns={[
                {
                  field: 'name',
                  displayName: t('table.name'),
                },
                {
                  field: 'social_id',
                  displayName: t('table.socialId'),
                },
                {
                  field: 'remarks',
                  displayName: t('table.remarks'),
                },
              ]}
              columnRenderers={{
                name: NameCell,
              }}
              path="patients"
              allowEditing={isAdmin}
              allowDelete={isAdmin}
              pageSize={10}
              query={query}
              formComponent={PatientsForm}
              showAddButton={isAdmin}
              getApiBase={getApiBase}
              showNot={showNotification}
              labels={gridLabels}
              onRowClick={handlePatientRowClick}
            />
          </div>

          {/*
              DIVIDER
           */}
          <div
            style={{
              width: '1px',
              background: '#e5e7eb',
              alignSelf: 'stretch',
              flexShrink: 0,
            }}
          />

          {/*
              RIGHT: SELECTED PATIENT
          */}
          <div
            style={{
              flex: '0 0 50%',
              minWidth: 0,
              paddingLeft: '1.5rem',
            }}
          >
            {!selectedPatient && (
              <p
                style={{
                  color: '#6b7280',
                  fontStyle: 'italic',
                  marginTop: '4rem',
                  textAlign: 'center',
                }}
              >
                {t('patients.panel.selectPatient')}
              </p>
            )}

            {selectedPatient && (
              <div>
                {/*
                    PATIENT HEADER
                */}
                <div
                  className="tab-header"
                  style={{
                    backgroundColor: 'white',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        marginBottom: '0.25rem',
                      }}
                    >
                      {patientName}
                    </h2>

                    {selectedPatient.social_id && (
                      <span
                        style={{
                          color: '#6b7280',
                          fontSize: '0.9rem',
                        }}
                      >
                        {selectedPatient.social_id}
                      </span>
                    )}
                  </div>
                </div>

                {/*
                    GROUP HEADER
               */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <h3 style={{ margin: 0 }}>{t('patients.panel.groups')}</h3>

                  {canManagePatients && (
                    <button
                      type="button"
                      className="server-grid-add-button"
                      title={t('patients.panel.addToGroup', 'Add to group')}
                      onClick={() => setShowGroupModal(true)}
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>

                {/*
                    PATIENT GROUPS SERVER GRID
              */}
                <ServerGrid
                  key={groupRefreshKey}
                  columns={[
                    {
                      field: 'name',
                      displayName: t('table.name'),
                    },
                    {
                      field: 'access_key',
                      displayName: t('groups.table.accessKey'),
                    },
                  ]}
                  path={`patients/${selectedPatient.id}/groups`}
                  allowEditing={false}
                  allowDelete={canManagePatients}
                  pageSize={10}
                  showAddButton={false}
                  getApiBase={getApiBase}
                  showNot={showNotification}
                  labels={gridLabels}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/*
          ADD PATIENT TO GROUP MODAL
      */}
      {showGroupModal && selectedPatient && (
        <PatientGroupsModal
          patientId={Number(selectedPatient.id)}
          patientName={patientName}
          existingGroups={[]}
          onClose={() => setShowGroupModal(false)}
          onGroupAdded={() => {
            setShowGroupModal(false);

            // Reload groups ServerGrid.
            setGroupRefreshKey((value) => value + 1);
          }}
        />
      )}
    </>
  );
}

/*
   PATIENT FORM
 */
function PatientsForm({
  data,
  setData,
  errors,
}: {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
  errors?: Record<string, string[]>;
}) {
  const { t } = useTranslation();

  const getValue = (field: string) => data?.[field] ?? '';

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev: any) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  return (
    <div className="add-user-form">
      <div className="add-user-form-grid">
        <div>
          <label className="form-label">{t('table.form.firstName')}</label>

          <input type="text" className="form-input" value={getValue('first_name')} onChange={handleChange('first_name')} />
          <FieldValidationError errors={errors} field="first_name" />
        </div>

        <div>
          <label className="form-label">{t('table.form.lastName')}</label>

          <input type="text" className="form-input" value={getValue('last_name')} onChange={handleChange('last_name')} />
          <FieldValidationError errors={errors} field="last_name" />
        </div>

        <div>
          <label className="form-label">{t('table.form.socialId')}</label>

          <input type="text" className="form-input" value={getValue('social_id')} onChange={handleChange('social_id')} />
          <FieldValidationError errors={errors} field="social_id" />
        </div>

        <div>
          <label className="form-label">{t('table.form.remarks')}</label>

          <input type="text" className="form-input" value={getValue('remarks')} onChange={handleChange('remarks')} />
          <FieldValidationError errors={errors} field="remarks" />
        </div>
      </div>
    </div>
  );
}
