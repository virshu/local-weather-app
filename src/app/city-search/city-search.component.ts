import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { FlexLayoutModule } from '@ngbracket/ngx-layout'
import { Store } from '@ngrx/store'
import { debounceTime, filter, tap } from 'rxjs/operators'

import { SearchActions } from '../actions/search.actions'
import * as fromSearch from '../reducers/search.reducer'
import { WeatherService } from '../weather/weather.service'

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css'],
})
export class CitySearchComponent {
  search = new FormControl('', [Validators.required, Validators.minLength(2)])

  constructor(
    private weatherService: WeatherService,
    private store: Store<fromSearch.WeatherState>
  ) {
    this.search.valueChanges
      .pipe(
        takeUntilDestroyed(),
        filter(() => this.search.valid),
        debounceTime(1000),
        tap((searchValue) => this.doSearch(searchValue))
      )
      .subscribe()
  }

  doSearch(searchValue: string | null) {
    if (searchValue === null) return
    const userInput = searchValue.split(',').map((s) => s.trim())
    const searchText = userInput[0]
    const country = userInput.length > 1 ? userInput[1] : undefined

    switch (this.weatherService.reactivityMode()) {
      case 'signal':
        this.signalBasedSearch(searchText, country)
        break
      case 'subject':
        this.behaviorSubjectBasedSearch(searchText, country)
        break
      case 'ngrx':
        this.ngRxBasedSearch(searchText, country)
        break
    }
  }

  signalBasedSearch(searchText: string, country?: string) {
    this.weatherService.updateCurrentWeatherSignal(searchText, country)
  }

  behaviorSubjectBasedSearch(searchText: string, country?: string) {
    this.weatherService.updateCurrentWeather(searchText, country)
  }

  ngRxBasedSearch(searchText: string, country?: string) {
    this.store.dispatch(SearchActions.search({ searchText, country }))
  }
}
