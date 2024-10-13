import { Component } from '@angular/core';
import { TeamService } from '../../team.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  team1: string = '';
  team2: string = '';
  team1Info: any = { squad: [], transfers: [] };
  team2Info: any = { squad: [], transfers: [] };
  errorMessage: string = '';
  loading: boolean = false;  // Loading state

  constructor(public teamService: TeamService) {}

  searchTeams() {
    if (this.team1 === '' && this.team2 === '') {
      this.errorMessage = "Please enter both teams' names.";
      return;
    }

    this.loading = true;  // Set loading state to true
    this.errorMessage = '';  // Clear previous error messages

    // Fetch team 1 information
    this.teamService.getTeamInfo(this.team1).subscribe(
      data => {
        if (data && data.squad && data.transfers) {
          this.team1Info.squad = data.squad;
          this.team1Info.transfers = data.transfers;
        } else {
          this.errorMessage = 'No information available for team 1.';
        }
      },
      error => {
        this.errorMessage = 'Team 1 not found or an error occurred.';
      },
      () => this.loading = false  // Reset loading state after request completes
    );

    // Fetch team 2 information
    this.teamService.getTeamInfo(this.team2).subscribe(
      data => {
        if (data && data.squad && data.transfers) {
          this.team2Info.squad = data.squad;
          this.team2Info.transfers = data.transfers;
        } else {
          this.errorMessage = 'No information available for team 2.';
        }
      },
      error => {
        this.errorMessage = 'Team 2 not found or an error occurred.';
      },
      () => this.loading = false  // Reset loading state after request completes
    );
  }
}
