import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  title: string = 'Hero manager';
  searchValue = new FormControl('');

  clearSearchForm(): void {
    this.searchValue.setValue('');
  }

  searchFormHasValue(): boolean {
    return this.searchValue.value != undefined && this.searchValue.value != ''; 
  }
}
