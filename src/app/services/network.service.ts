import { Injectable, OnDestroy } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Subject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class NetworkService implements OnDestroy {
    disconnectSubscription: Subscription;
    connectSubscription: Subscription;
    
    private networkConnectionState: boolean = false;
    
    public networkStateSubject = new Subject();
    
    constructor(
        private network: Network,
    ) {
        this.networkConnectionState = this.network.type !== this.network.Connection.NONE;
        this.initListeners();
    }
    
    initListeners(): void {
        this.disconnectSubscription = this.network.onDisconnect().subscribe((disconnectData: any)=>{
            this.networkConnectionState = false;
            this.networkStateSubject.next({internetState: 'disconnect'})
        });
    
        this.connectSubscription = this.network.onConnect().subscribe((connectData: any) => {
            // We just got a connection but we need to wait briefly
            // before we determine the connection type. Might need to wait.
            // prior to doing any api requests as well.
            setTimeout(() => {
                this.networkConnectionState = true;
                this.networkStateSubject.next({internetState: 'connect'});
            }, 3000);
        });
    }
    
    ngOnDestroy(): void {
        if ( this.disconnectSubscription && !this.disconnectSubscription.closed ) {
            this.disconnectSubscription.unsubscribe();
        }
        if ( this.connectSubscription && !this.connectSubscription.closed ) {
            this.connectSubscription.unsubscribe();
        }
    }
    
    public isInternetConnected (): boolean {
        return this.networkConnectionState;
    }
}
