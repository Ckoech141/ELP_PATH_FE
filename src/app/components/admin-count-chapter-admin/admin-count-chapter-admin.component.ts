import { Component } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-admin-count-chapter-admin',
  templateUrl: './admin-count-chapter-admin.component.html',
  styleUrl: './admin-count-chapter-admin.component.scss'
})
export class AdminCountChapterAdminComponent {
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
