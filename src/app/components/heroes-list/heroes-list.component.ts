import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Heroe } from '../../shared/interfaces/heroe/heroe.interface';
import { ApiData, MarvelService } from '../../shared/services/marvel.service';
import { TeamService } from '../../shared/services/team.service';

@Component({
  selector: 'app-heroes-list',
  standalone: true,
  imports: [
    CommonModule,
    InfiniteScrollDirective,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './heroes-list.component.html',
  styleUrl: './heroes-list.component.scss',
})
export class HeroesListComponent implements OnInit {
  teamHeroes: Heroe[] = [];

  findFilter!: FormGroup;
  isSearching: boolean = false;
  heroes$!: Observable<ApiData<Heroe>>;

  constructor(
    private marvelService: MarvelService,
    private fb: FormBuilder,
    private teamService: TeamService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.findFilter = this.fb.group({
      heroName: [''],
    });

    this.heroes$ = this.marvelService.heroes$;

    this.findFilter
      .get('heroName')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((heroName) => {
        this.search(heroName);
      });

    this.getHeroes();
    this.showHeroeTeam();
  }

  onScroll(): void {
    const offset = this.marvelService._heroesState.data?.results.length || 0;
    const limit = 6;
    console.log(offset);
    if (this.isSearching) {
      const name = this.findFilter.get('heroName')!.value;
      this.marvelService.searchHeroes(name, offset, limit);
    } else {
      this.marvelService.getHeroes(offset, limit);
    }
  }

  search(heroName: string): void {
    this.marvelService.resetHeroes();
    if (heroName.trim().length === 0) {
      this.isSearching = false;
      this.marvelService.getHeroes();
    } else {
      this.isSearching = true;
      this.marvelService.searchHeroes(heroName);
    }
  }

  private getHeroes(): void {
    this.marvelService.getHeroes();
  }

  addHeroe(heroe: Heroe): void {
    const isFull = this.teamService.myHeroesTeam.length >= 6;
    if (isFull) {
      this.toastrService.error('Equipo completo (Max. 6 héroes)');
      return;
    }
    this.teamService.addHeroe(heroe);
    this.showHeroeTeam();

    this.toastrService.success(`${heroe.name} añadido al equipo`);
  }

  removeHeroe(heroe: Heroe): void {
    this.teamService.removeHeroe(heroe);
    this.showHeroeTeam();

    this.toastrService.warning(`${heroe.name} eliminado del equipo`);
  }

  isHeroeInTeam(heroe: Heroe): boolean {
    return this.teamService.isHeroeInTeam(heroe);
  }

  showHeroeTeam(): void {
    this.teamHeroes = this.teamService.myHeroesTeam;
  }
}
