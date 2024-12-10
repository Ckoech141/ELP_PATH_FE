import { Component } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-admin-count-hub-admin',
  templateUrl: './admin-count-hub-admin.component.html',
  styleUrl: './admin-count-hub-admin.component.scss'
})
export class AdminCountHubAdminComponent {
  url!: string;
  totalAdmins!: any;
  constructor(private roleService: RoleService) {}

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
