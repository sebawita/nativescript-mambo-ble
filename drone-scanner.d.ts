import { Observable } from 'rxjs';
import { Drone } from './drone';
export declare class DroneScanner {
    static scan(): Observable<Drone>;
    private static checkIfMambo(peripheral);
    static initialisePermissionsIfRequired(): void;
    static hasPermissions(): Promise<boolean>;
    static requestPermissions(): void;
}
