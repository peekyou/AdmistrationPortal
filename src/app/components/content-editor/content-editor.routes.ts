import { Routes } from '@angular/router';

import { ContentEditorComponent } from './content-editor.component';
import { AuthGuard } from '../../guards/auth.guard';
import { PermissionGuard } from '../../guards/permission.guard';
import { PendingChangesGuard } from '../../guards/pending-changes.guard';
import { Permissions } from '../../core/helpers/permissions';

export const routes: Routes = [
    {
        path: 'content',
        component: ContentEditorComponent,
        data: { permission: Permissions.Content },
        canActivate: [AuthGuard, PermissionGuard],
        canDeactivate: [PendingChangesGuard]
    }
];