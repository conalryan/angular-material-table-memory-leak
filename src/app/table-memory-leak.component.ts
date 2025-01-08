import { CdkTableModule } from '@angular/cdk/table';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, Subject, takeUntil, tap, timer } from 'rxjs';

export interface SimpleData {
  id: number;
  name: string;
}

export const SIMPLE_DATA: SimpleData[] = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
  { id: 4, name: 'Bob Brown' },
  { id: 5, name: 'Charlie Davis' },
];

@Component({
  selector: 'table-memory-leak',
  imports: [CdkTableModule],
  template: `
    <h3>Table Memory Leak</h3>
    <table cdk-table [dataSource]="dataSource" [trackBy]="trackByFn">
      <ng-container cdkColumnDef="id">
        <th cdk-header-cell *cdkHeaderCellDef>ID</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.id }}</td>
      </ng-container>

      <ng-container cdkColumnDef="name">
        <th cdk-header-cell *cdkHeaderCellDef>Name</th>
        <td cdk-cell *cdkCellDef="let row">{{ row.name }}</td>
      </ng-container>

      <tr cdk-header-row *cdkHeaderRowDef="['id', 'name']"></tr>
      <tr cdk-row *cdkRowDef="let row; columns: ['id', 'name']"></tr>
    </table>
  `,
  styles: `
    table {
      margin: 0 auto;
      table-layout: fixed;
      width: 800px;
    }
  `,
})
export class TableMemoryLeakComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name'];
  dataSource = new MatTableDataSource<SimpleData>();
  #unsubscribe$ = new Subject<void>();

  ngOnInit() {
    this.#poll().subscribe((res) => {
      this.dataSource.data = res;
    });
  }

  ngOnDestroy() {
    this.#unsubscribe$.next();
    this.#unsubscribe$.complete();
  }

  trackByFn(index: number, item: SimpleData) {
    return item.id;
  }

  #poll(ms = 2500): Observable<SimpleData[]> {
    // Simulating periodic refreshes (every few seconds the REST endpoint can be executed to update the view without user refreshing)
    return timer(0, ms).pipe(
      /**
       * This is just to simulate creating new JS objects.
       * This is the case when you have here a REST call to backend.
       * Without that, Angular just knows this is exactly the same JS object, so it won't repaint anything.
       */
      tap((_) => console.log('[table-service]::fetch')),
      map((_) => JSON.parse(JSON.stringify(SIMPLE_DATA))),
      takeUntil(this.#unsubscribe$)
    );
  }
}
