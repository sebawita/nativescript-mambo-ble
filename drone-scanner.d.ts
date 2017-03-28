import { Observable } from 'rxjs';
import { Drone } from './drone';
export declare class DroneScanner {
    static scan(): Observable<Drone>;
    static initialisePermissionsIfRequired(): void;
    static hasPermissions(): Promise<boolean>;
    static requestPermissions(): void;
}
