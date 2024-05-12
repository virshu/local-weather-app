import { Component, effect, signal } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar'
import { FlexModule } from '@ngbracket/ngx-layout/flex'

import { CitySearchComponent } from "./city-search/city-search.component";
import { CurrentWeatherComponent } from './current-weather/current-weather.component'

const darkClassName = 'dark-theme';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: true,
    imports: [
        FlexModule,
        CurrentWeatherComponent,
        MatIconModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatCardModule,
        CitySearchComponent
    ]
})
export class AppComponent {
    readonly toggleState = signal(localStorage.getItem(darkClassName) === 'true');

    constructor() {
        effect(() => {
            localStorage.setItem(darkClassName, this.toggleState.toString());
            document.documentElement.classList.toggle(
                darkClassName, this.toggleState()
            );
        });
    }
}
