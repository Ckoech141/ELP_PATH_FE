import { Component } from '@angular/core';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-admin-chapterleader-card',
  templateUrl: './admin-chapterleader-card.component.html',
  styleUrls: ['./admin-chapterleader-card.component.scss'],
})
export class AdminChapterleaderCardComponent {
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
        console.log('Total number of users:', response);
        
      },
      (error) => {
        console.error('Error fetching user count:', error);
       
      }
    );
  }
}
