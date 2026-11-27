import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { NewRequestComponent } from './pages/new-request.component';
import { WorkspaceComponent } from './pages/workspace.component';
import { ApprovalsComponent } from './pages/approvals.component';
import { CaseDetailComponent } from './pages/case-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'My work | Northstar' },
  { path: 'request/new', component: NewRequestComponent, title: 'New request | Northstar' },
  { path: 'cases/:id', component: WorkspaceComponent, title: 'Assistant workspace | Northstar' },
  { path: 'approvals', component: ApprovalsComponent, title: 'Approvals | Northstar' },
  { path: 'cases/:id/details', component: CaseDetailComponent, title: 'Case details | Northstar' },
  { path: '**', redirectTo: '' },
];
