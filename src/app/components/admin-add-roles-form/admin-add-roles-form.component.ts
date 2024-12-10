import { Component, Inject } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-admin-add-roles-form',
  templateUrl: './admin-add-roles-form.component.html',
  styleUrls: ['./admin-add-roles-form.component.scss'],
})
export class AdminAddRolesFormComponent {
  // Declare class properties
  applicantId!: string;
  error!: any;
  url!: string;
  roleform: FormGroup; // Form group for the application form
  isSaving:boolean=false;

  constructor(
    private http: HttpServiceService,
    private snackbar:MatSnackBar,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AdminAddRolesFormComponent>
  ) {
    // Initialize the application form using FormBuilder
    this.roleform = this.fb.group({
      roleName: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Initialize URL for HTTP request
    this.url = this.http.serverUrl + 'roles/add-new-role';
    this.error = undefined;
  }

  // Handle form submission
  submit() {
    this.isSaving=true
    console.log(this.roleform.value.roleName);

    this.http.postData(this.url, this.roleform.value).subscribe({
      next: (response) => {
        console.log('POST request successful:', response);

        this.dialogRef.close();
      },
      error: (error) => {
        console.log('Error:', error);
        if (error.error.message1?.includes('Duplicate entry')) {
          this.error = 'Role already Exists!';
        } else {
          this.error = 'Server Error!';
        }

        // Handle the error here
      },
      complete: () => {
        this.isSaving=false;
        this.snackbar.open('System Role added successfully','Close',{duration:2000})
        
      },
    });
  }
}
