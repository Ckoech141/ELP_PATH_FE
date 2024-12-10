import { Component } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-admin-branch-champion-card',
  templateUrl: './admin-branch-champion-card.component.html',
  styleUrls: ['./admin-branch-champion-card.component.scss'],
})
export class AdminBranchChampionCardComponent {
  url!: string;
  totalAdmins!: any;
  constructor(private http: HttpServiceService,
    private roleService: RoleService) {}

  ngOnInit() {
    this.countUsers()
  }

  countUsers() {
    this.roleService.countUsers().subscribe(
      (response) => {
       
        this.totalAdmins = response;
        console.log('Total number of admins:', response);
        
      },
      (error) => {
        console.error('Error fetching user count:', error);
       
      }
    );
  }
}
