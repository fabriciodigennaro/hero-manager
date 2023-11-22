import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero.interface';
import { HeroesService } from 'src/app/services/heroes.service';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
})
export class HeroFormComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject();
  heroId: number = 0;
  heroToEdit: Hero | null = null;
  form: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _heroesService: HeroesService,
    private _router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this._fb.group({
      name: ['', [Validators.required]],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.heroId = this.route.snapshot.params['id'];
    this.isEditMode = this.heroId != undefined;
    if (this.isEditMode) {
      this.loadDataToEdit();
    }
  }

  private fetchHeroToEdit(): void {
    this._heroesService.hero$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((hero) => {
        if (hero) {
          this.heroToEdit = hero;
          this.setFormValues(hero);
        }
      });
  }

  private loadDataToEdit(): void {
    this.fetchHeroToEdit();
    this._heroesService.getHeroById(this.heroId);
  }

  private setFormValues(hero: Hero): void {
    this.form.patchValue(hero);
  }

  private editHero() {
    this._heroesService.updateHero({
      id: this.heroId,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
    });
  }

  private createHero() {
    this._heroesService.createHero({
      id: 0,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
    });
  }

  isInvalidField(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && field.touched;
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isEditMode ? this.editHero() : this.createHero();
      this.redirectToDashboard();
    }
  }

  redirectToDashboard(): void {
    this._router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }
}
