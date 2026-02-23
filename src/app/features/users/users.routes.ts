import { Routes } from '@angular/router';
import { UserTable } from './user-table/user-table';
import { UserDetail } from './user-detail/user-detail';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserTable
  },
  {
    path: ':id',
    component: UserDetail
  }
];