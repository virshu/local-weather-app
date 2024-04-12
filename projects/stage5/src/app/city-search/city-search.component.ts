import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { debounceTime } from 'rxjs';

import { WeatherService } from '../weather/weather.service';

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.css'
})
export class CitySearchComponent implements OnInit {
  search = new FormControl('', [Validators.minLength(2)]);

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.search.valueChanges.pipe(debounceTime(1000))
    .subscribe((searchValue: string | null) => {
      if (!this.search.invalid) {
        const userInput = searchValue!.split(',').map(s => s.trim());
        this.weatherService.updateCurrentWeather(
          userInput[0],
          userInput.length > 1 ? userInput[1] : undefined
        );
    }
  });
  }

}
