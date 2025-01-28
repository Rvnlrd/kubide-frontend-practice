import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Heroe } from '../../shared/interfaces/heroe/heroe.interface';
import { TeamService } from '../../shared/services/team.service';

@Component({
  selector: 'app-heroes-team',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './heroes-team.component.html',
  styleUrl: './heroes-team.component.scss',
})
export class HeroesTeamComponent {
  constructor(
    public teamService: TeamService,
    private toastrService: ToastrService,
  ) {}

  removeHeroe(heroe: Heroe): void {
    this.teamService.removeHeroe(heroe);
    this.toastrService.success(`${heroe.name} eliminado del equipo`);
  }

  isHeroeInTeam(heroe: Heroe): boolean {
    const isInTeam = this.teamService.isHeroeInTeam(heroe);
    if (isInTeam) {
      this.toastrService.warning(`${heroe.name} ya está en el equipo`);
    }

    return isInTeam;
  }

  heroTeamFull(): boolean {
    const isFull = this.teamService.myHeroesTeam.length >= 6;
    if (isFull) {
      this.toastrService.info('Equipo lleno');
    }

    return isFull;
  }
}
