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
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Heroe } from '../../shared/interfaces/heroe/heroe.interface';
import { MarvelService } from '../../shared/services/marvel.service';
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
  loading: boolean = false;
  heroes: Heroe[] = [];
  total: number = 0;
  findFilter!: FormGroup;
  isSearching: boolean = false;

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

    this.findFilter
      .get('heroName')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((heroName) => {
        this.search(heroName);
      });

    this.getHeroes();
  }

  onScroll(): void {
    const offset = this.heroes.length;
    const limit = 6;
    this.loading = true;

    if (this.isSearching) {
      const name = this.findFilter.get('heroName')!.value;
      this.marvelService.searchHeroes(name, offset, limit).subscribe((resp) => {
        this.heroes.push(...resp.results);
        this.total = resp.total;
        this.loading = false;
      });
    } else {
      this.marvelService.getHeroes(offset, limit).subscribe((resp) => {
        this.heroes.push(...resp.results);
        this.total = resp.total;
        this.loading = false;
      });
    }
  }

  search(heroName: string): void {
    this.loading = true;

    if (heroName.trim().length === 0) {
      this.isSearching = false;

      this.marvelService.getHeroes().subscribe({
        next: (resp) => {
          this.heroes = resp.results;
          this.total = resp.total;
          this.loading = false;
        },
      });
    } else {
      this.isSearching = true;

      this.marvelService.searchHeroes(heroName).subscribe({
        next: (resp) => {
          this.heroes = resp.results;
          this.total = resp.total;
          this.loading = false;
        },
      });
    }
  }

  private getHeroes(): void {
    this.loading = true;
    this.marvelService.getHeroes().subscribe({
      next: (resp) => {
        if (resp && resp.results) {
          this.heroes = resp.results;
          this.total = resp.total;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar héroes:', err), (this.loading = false);
      },
    });
  }

  addHeroe(heroe: Heroe): void {
    const isFull = this.teamService.myHeroesTeam.length >= 6;
    if (isFull) {
      this.toastrService.error('Equipo completo (Max. 6 héroes)');
      return;
    }
    this.teamService.addHeroe(heroe);
    this.toastrService.success(`${heroe.name} añadido al equipo`);
  }

  removeHeroe(heroe: Heroe): void {
    this.teamService.removeHeroe(heroe);
    this.toastrService.warning(`${heroe.name} eliminado del equipo`);
  }

  isHeroeInTeam(heroe: Heroe): boolean {
    return this.teamService.isHeroeInTeam(heroe);
  }
}
