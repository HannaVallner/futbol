import { Component } from '@angular/core';
import { TeamService } from '../../team.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  team1 = '';
  team2 = '';
  team1Info: any[] = [];
  team2Info: any[] = [];
  errorMessage = '';

  constructor(public teamService: TeamService) {}

  searchTeams() {
    if (this.team1 != '' && this.team2 != '') {
      this.teamService.getTeamInfo(this.team1).subscribe(
        data => {
          if (data && data.squad) {
            this.team1Info = data.squad;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'No squad information available.';
          }
        },
        error => {
          this.errorMessage = 'Team not found or an error occurred.';
        }
      );
      this.teamService.getTeamInfo(this.team1).subscribe(
        data => {
          if (data && data.squad) {
            this.team2Info = data.squad;
            this.errorMessage = '';
          } else {
            this.errorMessage = 'No squad information available.';
          }
        },
        error => {
          this.errorMessage = 'Team not found or an error occurred.';
        }
      );
    } else {
      this.errorMessage = "Please enter both teams' names"
    }
  }
}
