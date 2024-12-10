import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-admin-superadmin-card',
  templateUrl: './admin-superadmin-card.component.html',
  styleUrls: ['./admin-superadmin-card.component.scss'],
})
export class AdminSuperadminCardComponent implements OnInit {
  url!: string;
  totalSuperadmin!: any;
  totalUsers: any;
  constructor(private http: HttpServiceService,
    private roleService: RoleService) {}

  ngOnInit(): void {
    this.countAllUsers();
  }

  countAllUsers() {
    this.roleService.countAllUsers().subscribe(
      (response) => {
       
        this.totalUsers = response;
        console.log('Number of users:', this.totalUsers);
        
      },
      (error) => {
        console.error('Error fetching user count:', error);
       
      }
    );
  }
  
}
