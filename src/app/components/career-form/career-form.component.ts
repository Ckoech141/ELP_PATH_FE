import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-career-form',
  templateUrl: './career-form.component.html',
  styleUrls: ['./career-form.component.scss'],
 
})
export class CareerFormComponent {
  @ViewChild('input')
  input!: ElementRef<HTMLInputElement>;
  @ViewChild('careerform', { static: false }) careerform!: NgForm;
  end_date!: string;
  start_date!: string;
  isUpdating: boolean = false
  toDate!: string;
  description!: string;
  companyName!: string;
  organizationSector!:string;
  position!:string;
  title!: string;
  userId!: string;
  sector! : string;
  Sector: any;
  careerRole: any;
  selectedSector!:string
  options: string[] = ['One', 'Two', 'Three', 'Four', 'Five'];
  filteredOptions: string[];
  myControl = new FormControl('');
  sectors: string[] = [
    'Agriculture',
    'Technology',
    'Healthcare',
    'Financial',
    'Industrial']
  constructor(
    private http: HttpServiceService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CareerFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filteredOptions = this.sectors.slice();
  }
  url!: string;
  ngOnInit() {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      // Use the parsed data in your application
      this.userId = parsedData.id;
      this.url = this.http.serverUrl + 'career/' + this.userId + '/create';
    }
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.sectors.filter(o => o.toLowerCase().includes(filterValue));
  }
  status = this.fb.group({
    state: new FormControl(false),
  });


  

  submit() {
    if (!this.description && !this.careerRole && !this.start_date && !this.position && !this.organizationSector) {
        alert("All fields are required")
    } else {
      const data = {
        ...this.careerform.value,
        toDate:this.status.value.state
      }
      this.isUpdating = true
      console.log('Form Submitted !', data);
      this.http.postData(this.url, data).subscribe({
        next: (response) => {
          console.log('POST request successful:', response);
          console.log(this.careerform.value);
  
          // Handle the response data here
          // localStorage.setItem('token', JSON.stringify(response));
          this.dialogRef.close();
          this.snackBar.open("career added successfully", "Close", {duration: 2000})
        },
        error: (error) => {
          console.log('Error:', error);
          this.snackBar.open(error.error.message, "Close", {duration:3600})
          this.isUpdating = false
          // Handle the error here
        },
        complete: () => {
          this.isUpdating = false
    
        },
      });
    }


  }
}
