import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Heroe } from '../../shared/interfaces/heroe/heroe.interface';
import { MarvelService } from '../../shared/services/marvel.service';
import { TeamService } from '../../shared/services/team.service';
import { HeroesComicsComponent } from '../heroes-comics/heroes-comics.component';

@Component({
  selector: 'app-heroes-detail',
  templateUrl: './heroes-detail.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, HeroesComicsComponent],
  styleUrl: './heroes-detail.component.scss',
})
export class HeroesDetailComponent implements OnInit {
  heroe!: Heroe;
  heroeId: number = 0;
  selectedHeroe: Heroe | null = null;
  currentPage: number = 1;

  constructor(
    private route: ActivatedRoute,
    private marvelService: MarvelService,
    private teamService: TeamService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.heroeId = this.route.snapshot.params['id'];
    this.marvelService.getHeroById(this.heroeId).subscribe({
      next: (resp) => {
        if (resp && resp.results) {
          this.heroe = resp.results[0];
        }
      },
      error: (err) => console.error('Error al cargar héroes:', err),
    });
  }

  selectHeroe(heroe: Heroe): void {
    this.selectedHeroe = heroe;
  }

  getHeroeComics(hero: Heroe): string {
    return hero.comics.available.toString();
  }

  getHeroeSeries(hero: Heroe): string {
    return hero.series.available.toString();
  }

  getHeroeStories(hero: Heroe): string {
    return hero.stories.available.toString();
  }

  addHeroe(heroe: Heroe): void {
    if (this.teamService.isHeroeInTeam(heroe)) {
      this.toastrService.error('Héroe ya en tu equipo');
      return;
    }

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
