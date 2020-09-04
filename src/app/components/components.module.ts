import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CityWeatherComponent } from './city-weather/city-weather';
import { DayWeatherComponent } from './day-weather/day-weather';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
    ],
    declarations: [
        CityWeatherComponent,
        DayWeatherComponent,
    ],
    exports: [
        CityWeatherComponent,
        DayWeatherComponent,
    ],
})
export class ComponentsModule {
}
