import { Routes } from '@angular/router';
import { TableMemoryLeakComponent } from './table-memory-leak.component';

export const routes: Routes = [
  { path: 'table-memory-leak', component: TableMemoryLeakComponent },
  { path: '**', redirectTo: 'table-memory-leak' },
];
