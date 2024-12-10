import { Component, ViewChild, Inject, ElementRef } from '@angular/core';
import { HttpServiceService } from 'src/app/services/http-service.service';
import { FormBuilder, FormControl, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-career-update',
  templateUrl: './career-update.component.html',
  styleUrl: './career-update.component.scss'
})
export class CareerUpdateComponent {
  @ViewChild('input')
  input!: ElementRef<HTMLInputElement>;
  @ViewChild('careerform', { static: false }) careerform!: NgForm;
  end_date!: string;
  isUpdating:boolean = false
  start_date!: string;
  description!: string;
  companyName!: string;
  organizationSector!:string;
  position!:string;
  title!: string;
  userId!: string;
  toDate:boolean = false
  sector! : string;
  Sector: any;
  careerRole: any;
  careerData:any;
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
    public dialogRef: MatDialogRef<CareerUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.filteredOptions = this.sectors.slice();
  }
  url!: string;
  ngOnInit() {
    
    console.log("1234", this.data);
    this.careerData = this.data.data
    this.description = this.careerData.description;
    this.careerRole = this.careerData.careerRole
    this.position = this.careerData.position
    this.organizationSector = this.careerData.organizationSector
    this.companyName = this.careerData.companyName
    this.start_date = this.careerData.start_date
    
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      // Use the parsed data in your application
      this.userId = parsedData.id;
      //http://52.15.152.26:5555/career/user/130/12/update

      this.url = this.http.serverUrl + 'career/user/'  +  this.userId + '/' + this.careerData.id + '/update';
    }
  }

  filter(): void {
    const filterValue = this.input.nativeElement.value.toLowerCase();
    this.filteredOptions = this.sectors.filter(o => o.toLowerCase().includes(filterValue));
  }
  status = this.fb.group({
    state: new FormControl(''),
  });
  submit() {

    this.isUpdating = true
    console.log('Form Submitted !', this.careerform.value);
    if (this.status.value.state) {
      const career = {
        ...this.careerform.value,
        toDate:this.status.value.state
      }
      const careerUrl = this.http.serverUrl + 'career/user/'  +  this.userId + '/' + this.careerData.id + '/to-date-update';
      this.http.putData(careerUrl, career).subscribe({
        next: (response) => {
          console.log('POST request successful:', response);
          console.log(career);
          // Handle the response data here
          // localStorage.setItem('token', JSON.stringify(response));
          this.dialogRef.close();
        },
        error: (error) => {
          console.log('Error:', error);
          // Handle the error here
        },
        complete: () => {
          this.isUpdating = false
          this.snackBar.open("Career updated successfully", "Close", {duration:2000})
        },
      });
    } else {
      
      const data = {
        ...this.careerform.value,
        toDate:this.status.value.state
      }
      this.http.putData(this.url, data).subscribe({
        next: (response) => {
          console.log('POST request successful:', response);
          console.log(data);
          // Handle the response data here
          // localStorage.setItem('token', JSON.stringify(response));
          this.dialogRef.close();
        },
        error: (error) => {
          console.log('Error:', error);
          // Handle the error here
        },
        complete: () => {
          this.isUpdating = false
          this.snackBar.open("Career updated successfully", "Close", {duration:2000})
        },
      });
    }


  }
}

