import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Hero, HeroResponse } from 'src/app/interfaces/hero.interface';
import { HeroesService } from 'src/app/services/heroes.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  heroList: Hero[] = [];
  title: string = 'Hero manager';
  searchValue = new FormControl('');
  totalReults: number = 0;

  constructor(private _heroesService: HeroesService) {}

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(page: number = 0): void {
    this._heroesService
      .getHeroes()
      .subscribe((heroesResponse: HeroResponse) => {
        this.heroList = heroesResponse.heroes.slice(page, page + 5);
        this.totalReults = heroesResponse.totalResult;
      });
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.getHeroes(5);
  }

  clearSearchForm(): void {
    this.searchValue.setValue('');
  }

  searchFormHasValue(): boolean {
    return this.searchValue.value != undefined && this.searchValue.value != '';
  }
}
