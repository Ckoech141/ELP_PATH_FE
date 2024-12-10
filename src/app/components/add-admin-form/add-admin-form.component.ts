import { Component, Inject } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RoleService } from 'src/app/services/role.service';
import { ToastrService } from 'ngx-toastr';

function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.value;

  // Define your custom validation logic here
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Check if all required conditions are met
  const isValid = hasUpperCase && hasLowerCase && hasSpecialCharacter;

  // Return an error object if validation fails
  return isValid ? null : { invalidPassword: true };
}

@Component({
  selector: 'app-add-admin-form',
  templateUrl: './add-admin-form.component.html',
  styleUrls: ['./add-admin-form.component.scss'],
})
export class AddAdminFormComponent {
  // Declare class properties
  userId!: string;
  urlGetroles!: string;
  urlGetSchool!: string;
  urlLinkApplicationSchool!: string;
  adminform: FormGroup; // Form group for the application form
  
  // Initialize roles and school options arrays
  url!: string;
  rolesOptions: any;
  schoolOptions!: any[];
  roleId: any;

  constructor(
    private http: HttpServiceService,
    private roleService:RoleService,
    private toast:ToastrService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddAdminFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      // Initialize the application form using FormBuilder
      this.adminform = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        userEmail: ['', [Validators.required, Validators.email]],
        userPassword: ['', [Validators.required, Validators.minLength(8), passwordValidator]],
         roleName: ['', Validators.required],
        
        // role: this.fb.group({
          //   id: ['', Validators.required],
          // }),
        });
      }

  ngOnInit() {
   
    // Fetch roles options from the server
    this.getAllRoles();
  }

  // Fetch roles data from the server

  getAllRoles() {
    this.roleService.getAllRoles().subscribe(
      (response) => {
        console.log('All Roles:', response);
        this.rolesOptions = response.payload;
        this.toast.success('Roles fetched successfully')
      },
      (error) => {
        console.error('Error fetching roles:', error);
        this.toast.error('Error fetching roles');
      }
    );
  }

  getRoleId(event: any): void {
    this.roleId = event.value;
    console.log("Role ID"+event.value)
  }

  submit() {
    console.log(this.adminform.value);
    // Submit application form data to the server

    // console.log("Role ID"+this.roleId)

    this.roleService.createUser(this.url, this.adminform.value).subscribe({
      next: (response) => {
        console.log('POST request successful:', response);

        this.dialogRef.close();
          this.toast.success("user created successfully")
        },
        error: (error) => {
          console.log('Error:', error);
          this.toast.error("error creating user")
        // Handle the error here
      },
      complete: () => {},
    });
  }
}
