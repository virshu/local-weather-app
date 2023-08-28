import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import {
  ObservablePropertyStrategy,
  autoSpyObj,
  injectSpy,
  addProperty,
} from 'angular-unit-test-helper'
import { of, first } from 'rxjs'

import { MaterialModule } from '../material.module'
import { ICurrentWeather } from '../interfaces'
import { WeatherService, defaultWeather } from '../weather/weather.service'
import { fakeWeather } from '../weather/weather.service.fake'
import { CurrentWeatherComponent } from './current-weather.component'

/* eslint-disable-next-line arrow-body-style */
export const spyGetter = <T, K extends keyof T>(
  target: jasmine.SpyObj<T>,
  key: K
): jasmine.Spy => {
  return Object.getOwnPropertyDescriptor(target, key)?.get as jasmine.Spy
}

/* eslint-disable-next-line arrow-body-style */
export const spySetter = <T, K extends keyof T>(
  target: jasmine.SpyObj<T>,
  key: K
): jasmine.Spy => {
  return Object.getOwnPropertyDescriptor(target, key)?.set as jasmine.Spy
}

describe('CurrentWeatherComponent', () => {
  let component: CurrentWeatherComponent
  let fixture: ComponentFixture<CurrentWeatherComponent>
  let weatherServiceMock: jasmine.SpyObj<WeatherService>
  let store: MockStore<{ search: { current: ICurrentWeather } }>
  const initialState = { search: { current: defaultWeather } }

  beforeEach(waitForAsync(() => {
    const weatherServiceSpy = autoSpyObj(
      WeatherService,
      ['currentWeather$'],
      ObservablePropertyStrategy.BehaviorSubject
    )

    addProperty(weatherServiceSpy, 'reactivityMode', () => 'subject')

    TestBed.configureTestingModule({
      imports: [MaterialModule, CurrentWeatherComponent],
      providers: [
        { provide: WeatherService, useValue: weatherServiceSpy },
        provideMockStore({ initialState }),
      ],
    }).compileComponents()

    weatherServiceMock = injectSpy(WeatherService)
    store = TestBed.inject(Store) as MockStore<{ search: { current: ICurrentWeather } }>
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentWeatherComponent)
    component = fixture.componentInstance
  })

  it('should create', () => {
    // Arrange
    weatherServiceMock.getCurrentWeather.and.returnValue(of())

    // Act
    fixture.detectChanges() // triggers ngOnInit

    // Assert
    expect(component).toBeTruthy()
  })

  it('should get currentWeather from weatherService', (done) => {
    // Arrange
    store.setState({ search: { current: fakeWeather } })
    weatherServiceMock.currentWeather$.next(fakeWeather)

    // Act
    fixture.detectChanges() // triggers ngOnInit()

    // Assert
    expect(component.current$).toBeDefined()

    component.current$.pipe(first()).subscribe((current) => {
      expect(current.city).toEqual('Bethesda')
      expect(current.temperature).toEqual(280.32)

      // Assert on DOM
      const debugEl = fixture.debugElement
      const titleEl: HTMLElement = debugEl.query(By.css('.mat-headline-6')).nativeElement
      expect(titleEl.textContent).toContain('Bethesda')
      done()
    })
  })
})
