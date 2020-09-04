import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { NetworkService } from '../services/network.service';
import { AlertController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class NetworkGuard implements CanActivate {
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;
    
    constructor( private networkService: NetworkService,
                 private alertCtrl: AlertController,
    ) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let canActivate = this.networkService.isInternetConnected();
        
        if ( !canActivate ) {
            this.showAlert();
        }
        
        return canActivate;
    }
    
    async showAlert () {
        let alert = await this.alertCtrl.create({
            header: 'Недоступно',
            message: 'Подключение к сети интернет отсутствует. Нельзя получить подробную информацию о погоде в данном городе.',
            cssClass: 'network-off-alert',
            buttons: [
                { text: 'OK', cssClass: 'confirm-button' }
            ]
        });
        
        alert.present();
    }
}
