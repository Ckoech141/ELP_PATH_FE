import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
searchResults: { id: string, content: string, type: string }[] = [];
id!: string;


  constructor(private router: Router   
    ){
      this.searchControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.searchTextChanged.emit(value);
      });
    }

  ngOnInit(): void {
  }
  

  
  enteredSearchValue: string='';
  @Output()searchTextChanged: EventEmitter<string>= new EventEmitter<string>();
searchControl=new FormControl();

onSearchTextChanged(){
  this.searchTextChanged.emit(this.enteredSearchValue);
}
onSuggestionSelected(selectedSuggestion: any) {
  this.searchTextChanged.emit(selectedSuggestion);
  this.navigateToProfile(selectedSuggestion);
}

navigateToProfile(selectedSuggestion: any){
  const result: any = this.searchResults.find(result => result.id === selectedSuggestion.id);
  if (result.type === 'profile') {
    // Navigate to the profile page with the profile ID as a parameter
    this.router.navigate(['/profile', result.id]);
  } else if (result.type === 'hub') {
    // Navigate to the hub page with the hub ID as a parameter
    this.router.navigate(['/hub',result.id]);
}
}

}
