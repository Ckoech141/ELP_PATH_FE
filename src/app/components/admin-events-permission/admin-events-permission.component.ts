// Import the Component class from the Angular core library
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { AdminDeleteroleFormComponent } from '../admin-deleterole-form/admin-deleterole-form.component';

// Define a constant object called permissionMappings, which maps permission names to an array of associated permissions
const permissionMappings: { [key: string]: string[] } = {
  edit: ['EVENTS_UPDATE'],
  add: ['EVENTS_ADD', 'EVENTS_CHAPTER_ADD'],
  view: [
    'EVENTS_VIEW',
    'EVENTS_DATE_VIEW',
    'EVENTS_CHAPTER_VIEW',
    'EVENTS_CHAPTER_COUNT',
    'EVENTS_ACTIVE_VIEW',
    'EVENTS_ACTIVE_COUNT',
    'EVENTS_PAST_VIEW',
    'EVENTS_PAST_COUNT',
    'EVENTS_SCHEDULED_VIEW',
    'EVENTS_SCHEDULED_COUNT',
    'EVENTS_VIEW_ALL',
    'EVENTS_COUNT_ALL',
  ],
  delete: ['EVENTS_DELETE'],
};

@Component({
  selector: 'app-admin-events-permission',
  templateUrl: './admin-events-permission.component.html',
  styleUrls: ['./admin-events-permission.component.scss'],
})
export class AdminEventsPermissionComponent {
  // Initialize an array called adminRole with role information
  // adminRole: any = [
  //   {
  //     roleName: 'admin',
  //     id: '1',
  //     permissions: [],
  //   },
  //   {
  //     roleName: 'branch champion',
  //     id: '2',
  //     permissions: [],
  //   },
  //   { roleName: 'chapter leader', id: '3', permissions: [] },
  // ];
  adminRole: any;

  isChecked: boolean = false; // Initialize a boolean variable

  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  constructor(public http: HttpServiceService, public dialog: MatDialog) {}

  ngOnInit() {
    const url = this.http.serverUrl + 'roles/all';
    this.http.getData(url).subscribe({
      next: (response: any) => {
        console.log(response.data);
        this.adminRole = response.data;
      },
    });
  }

  // Function to handle changes in checkboxes
  handleCheckboxChange(event: any, adminId: string, permissionName: string) {
    this.isChecked = event.target.checked; // Update isChecked based on the checkbox state

    // Find the admin role in the adminRole array
    const adminToUpdate = this.adminRole.find(
      (admin: any) => admin.id === adminId
    );

    if (adminToUpdate) {
      const existingPermissions = new Set(adminToUpdate.permissions); // Create a Set to manage unique permissions
      const newPermissions = permissionMappings[permissionName]; // Get the associated permissions

      // Add or remove permissions based on the checkbox state
      if (this.isChecked) {
        newPermissions.forEach((perm) => existingPermissions.add(perm));
      } else {
        newPermissions.forEach((perm) => existingPermissions.delete(perm));
      }

      adminToUpdate.permissions = Array.from(existingPermissions); // Convert Set back to an array

      console.log(this.adminRole); // Log the updated adminRole array
    }
  }

  //checkbox true or false function
  checkboxTrueFalse(data: any, permission: string): boolean {
    return (
      permissionMappings[permission]
        .map((item: string) => {
          return data.permissions.indexOf(item) !== -1;
        })
        .filter((item: any) => item !== false).length ===
      permissionMappings[permission].length
    );
  }
  // method to send permissions to server
  submitPermissions() {
    this.adminRole.forEach((admin: any) => {
      const adminRolePermissions: any = [];
      adminRolePermissions.push({
        permissions: admin.permissions,
      });
      const url = this.http.serverUrl + `roles/${admin.id}/update`;
      console.log(adminRolePermissions[0]);

      this.http.putData(url, adminRolePermissions[0]).subscribe({
        next: (response) => {
          console.log(response);
        },
      });
    });
  }
  // method to call dialog
  deleteRoleDialog(roleId: string) {
    // Open the dialog using the MatDialog service
    const dialogRef: MatDialogRef<AdminDeleteroleFormComponent> =
      this.dialog.open(AdminDeleteroleFormComponent, {
        width: '50%',
        // Set the width of the dialog

        data: { data: roleId }, // You can pass data to the dialog component using the `data` property
      });

    // Handle the dialog result (if needed)
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.notifyParent.emit();
    });
  }
}
