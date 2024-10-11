import { Component } from '@angular/core';
import { TeamService } from '../../team.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  team1 = '';
  squad: any[] = [];
  errorMessage = '';

  constructor(public teamService: TeamService) {}

  // Triggered when user clicks search
  searchTeam() {
    this.teamService.getTeamInfo(this.team1).subscribe(
      data => {
        if (data && data.squad) {
          this.squad = data.squad;
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No squad information available.';
        }
      },
      error => {
        this.errorMessage = 'Team not found or an error occurred.';
      }
    );
  }
}
