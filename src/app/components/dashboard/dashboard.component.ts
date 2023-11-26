import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

import { Hero } from 'src/app/interfaces/hero.interface';
import { HeroesService } from 'src/app/services/heroes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject();
  heroList: Hero[] = [];
  title: string = 'Heroes manager';
  searchValue = new FormControl('');
  heroes$: Observable<Hero[]> = new Observable();
  page: number = 1;
  resultsPerPage: number = 5;
  totalResults: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private _heroesService: HeroesService,
    private _router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.searchHeroes();
    this.getHeroes();
    this.searchValue.statusChanges.subscribe(() => this.searchHeroes());
    this.getTotalResults();
  }

  handlePageEvent(pageEvent: PageEvent) {
    this.page = pageEvent.pageIndex + 1;
    this.resultsPerPage = pageEvent.pageSize;
    this.searchHeroes();
  }

  clearSearchForm(): void {
    this.searchValue.setValue('');
  }

  searchFormHasValue(): boolean {
    return this.searchValue.value != undefined && this.searchValue.value != '';
  }

  private getHeroes(): void {
    this.heroes$ = this._heroesService.heroesResultsPage$;
  }

  private searchHeroes(): void {
    const searchValue = this.searchValue.value ?? '';
    this._heroesService.searchHeroes(
      searchValue,
      this.page,
      this.resultsPerPage
    );
  }

  private getTotalResults(): void {
    this._heroesService.heroesTotalResults$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((newTotal) => {
        this.goToFistPageIfNewTotalResultsChangedAndPageIsBigger(newTotal);
        this.totalResults = newTotal;
      });
  }

  private goToFistPageIfNewTotalResultsChangedAndPageIsBigger(
    newTotal: number
  ) {
    const totalResultsChanged = this.totalResults != newTotal;
    const newMaxPage = Math.ceil(newTotal / this.resultsPerPage);
    const currentPageIsBiggerThanNewMaxPage = this.page > newMaxPage;
    if (totalResultsChanged && currentPageIsBiggerThanNewMaxPage) {
      this.paginator.firstPage();
    }
  }

  openHeroDetail(hero: Hero): void {
    this._router.navigate([`/detail/${hero.id}`]);
  }

  redirectToCreateForm(): void {
    this._router.navigate(['/create']);
  }

  redirectToEditForm(heroId: number): void {
    this._router.navigate([`/edit/${heroId}`]);
  }

  confirmDeletion(hero: Hero): void {
    const dialogref = this.dialog.open(ConfirmDialogComponent, {
      data: `Are you sure you want to remove ${hero.name} from your list of heroes?`,
    });
    dialogref.afterClosed().subscribe((confirmation) => {
      if (confirmation) {
        this.deleteHero(hero.id);
      }
    });
  }

  deleteHero(heroId: number): void {
    this._heroesService.deleteHero(heroId);
    this.searchHeroes();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}
