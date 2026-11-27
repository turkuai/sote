import { GridLabels } from 'grid/dist/Grid';
import { ServerGridLabels } from 'grid/dist/ServerGrid';
import { DialogLabels } from 'grid/dist/ServerGridEditDialog';
import { useTranslation } from 'react-i18next';

export function useServerGridLabels(): ServerGridLabels {
  const { t } = useTranslation();

  return {
    loading: t('grid.loading'),
    add: t('grid.add'),
    updateFailed: t('grid.errors.updateFailed'),
    itemUpdated: t('grid.success.itemUpdated'),
    listViewRequiresProps: t('grid.errors.listViewRequiresProps'),
    confirmDeleteTitle: t('grid.confirmDelete.title'),
    confirmDeleteMessage: t('grid.confirmDelete.message'),
    confirmDeleteLabel: t('grid.confirmDelete.delete'),
    deletingLabel: t('grid.confirmDelete.deleting'),
    cancelLabel: t('grid.confirmDelete.cancel'),
    editTitle: t('grid.dialog.edit'),
    addTitle: t('grid.dialog.add'),
    grid: useGridLabels(),
    dialog: useDialogLabels(),
  };
}

export function useGridLabels(): GridLabels {
  const { t } = useTranslation();

  return {
    actionsHeader: t('table.actions'),
    edit: t('table.edit'),
    add: t('grid.add'),
    delete: t('table.delete'),
    previous: t('grid.pagination.previous'),
    next: t('grid.pagination.next'),
    page: t('grid.pagination.page'),
    of: t('grid.pagination.of'),
  };
}

export function useDialogLabels(): DialogLabels {
  const { t } = useTranslation();

  return {
    save: t('grid.dialog.save'),
    cancel: t('grid.dialog.cancel'),
    close: t('grid.dialog.close'),
  };
}
