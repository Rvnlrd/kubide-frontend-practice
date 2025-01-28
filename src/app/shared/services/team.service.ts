import { Injectable } from '@angular/core';
import { Heroe } from '../interfaces/heroe/heroe.interface';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  myHeroesTeam: Heroe[] = [];
  heroeAdded: boolean = false;

  constructor() {
    const team = localStorage.getItem('myHeroesTeam');
    if (team) {
      this.myHeroesTeam = JSON.parse(team);
    }
  }

  private updateLocalStorage(): void {
    localStorage.setItem('myHeroesTeam', JSON.stringify(this.myHeroesTeam));
  }

  addHeroe(heroe: Heroe): void {
    if (this.myHeroesTeam.length >= 6) {
      console.log('No puedes agregar más de 6 héroes a tu equipo');
      return;
    }

    this.myHeroesTeam.push(heroe);
    this.updateLocalStorage();

    console.log('Heroe añadido a tu equipo ' + heroe.name);
    console.log(this.myHeroesTeam);
  }

  removeHeroe(heroe: Heroe): void {
    this.myHeroesTeam = this.myHeroesTeam.filter((h) => h.id !== heroe.id);
    this.updateLocalStorage();

    console.log('Heroe eliminado de tu equipo ' + heroe.name);
    console.log(this.myHeroesTeam);
  }

  isHeroeInTeam(heroe: Heroe): boolean {
    return this.myHeroesTeam.some((h) => h.id === heroe.id);
  }
}
