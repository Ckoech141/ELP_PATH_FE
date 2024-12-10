import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { countries } from 'src/assets/json_files/countries';

@Component({
  selector: 'app-more-people',
  templateUrl: './more-people.component.html',
  styleUrls: ['./more-people.component.scss'],
})
export class MorePeopleComponent {
  filterPeople!: FormGroup;

  scholarCategory: any[] = [
    { value: 'All', viewValue: 'All' },
    { value: 'ELP', viewValue: 'ELP' },
    { value: 'W2F', viewValue: 'W2F' },
    { value: 'W2F & ELP', viewValue: 'W2F & ELP' },
    { value: 'Elimu', viewValue: 'Elimu' },
    { value: 'Elimu & ELP', viewValue: 'Elimu & ELP' },
    { value: 'Elimu & TVET', viewValue: 'Elimu & TVET' },
    { value: 'W2F & TVET', viewValue: 'W2F & TVET' },
    { value: 'TVET', viewValue: 'TVET' },
    { value: 'Global', viewValue: 'Global' },
  ];

  constructor(public http: HttpServiceService) {}

  PeopleProfileData: any[] = [];
  getPeopleProfileUrl!: string;
  userId: any;
  ngOnInit() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      this.getPeopleProfile();
    }
  }

  // method to get PeopleProfile by chapter id or all PeopleProfile
  getPeopleProfile() {
    const userData = localStorage.getItem('userData');

    if (userData) {
      const parsedData = JSON.parse(userData);
      this.userId = parsedData.id;
    }

    this.getPeopleProfileUrl = this.http.serverUrl + 'profile/discover-people';

    // ====================================get method=======================================

    this.http.getData(this.getPeopleProfileUrl).subscribe({
      next: (response) => {
        console.log('this response',response);


        this.PeopleProfileData = response.payload
          .map((item: any) => {
            if (userData) {
              const parsedData = JSON.parse(userData);
              let userDataId = parsedData.id;
              if (userDataId !== item.userId) {
                return {
                  firstName: item.users.firstName,
                  lastName: item.users.lastName,
                  imageUrl: item.profileImage !== null ? item.profileImage : null,
                  branch: item.homeBranch.branchName,
                  userId: item.users.id,
                };
              }
            }
            // Return null when conditions aren't met
            return null;
          })
          .filter((item: any) => item !== null);
        console.log( 'response' ,this.PeopleProfileData);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });

    // ============================================================================
  }
}
