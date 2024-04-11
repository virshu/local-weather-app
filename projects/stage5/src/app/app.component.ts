import { Component } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatToolbarModule } from '@angular/material/toolbar'
import { FlexModule } from '@ngbracket/ngx-layout/flex'

import { CitySearchComponent } from "../city-search/city-search.component";
import { CurrentWeatherComponent } from './current-weather/current-weather.component'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [FlexModule, CurrentWeatherComponent, MatToolbarModule, MatCardModule, CitySearchComponent]
})
export class AppComponent {}
