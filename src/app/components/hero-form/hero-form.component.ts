import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Hero } from 'src/app/interfaces/hero.interface';
import { HeroesService } from 'src/app/services/heroes.service';

@Component({
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
})
export class HeroFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
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
    const paramsSubscription = this.route.params.subscribe((params) => {
      this.heroId = params['id'];
      this.isEditMode = this.heroId != undefined;
      if (this.isEditMode) {
        this.loadDataToEdit();
      }
    });
    this.subscriptions.push(paramsSubscription);
  }

  fetchHeroToEdit(): void {
    const heroesSubscription = this._heroesService.hero$.subscribe((hero) => {
      if (hero) {
        this.heroToEdit = hero;
        this.setFormValues(hero);
      }
    });
    this.subscriptions.push(heroesSubscription);
  }

  loadDataToEdit(): void {
    this.fetchHeroToEdit();
    this._heroesService.getHeroById(this.heroId);
  }

  setFormValues(hero: Hero): void {
    this.form.patchValue(hero);
  }

  isInvalidField(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!field && field.invalid && field.touched;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.heroId);

      if (this.isEditMode) {
        this._heroesService.updateHero({
          id: this.heroId,
          name: this.form.get('name')?.value,
          description: this.form.get('description')?.value,
        });
      } else {
        this._heroesService.createHero({
          id: 0,
          name: this.form.get('name')?.value,
          description: this.form.get('description')?.value,
        });
      }

      this.redirectToDashboard();
    }
  }

  redirectToDashboard(): void {
    this._router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
