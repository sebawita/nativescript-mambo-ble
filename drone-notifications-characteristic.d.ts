import { Observable } from 'rxjs';
export declare class DroneNotificationsCharacteristic {
    private deviceUUID;
    private serviceUUID;
    private characteristicUUID;
    private subject;
    private distinct;
    constructor(deviceUUID: string, serviceUUID: string, characteristicUUID: string);
    startNotifying(): Promise<any>;
    stopNotifying(): void;
    getObservable(): Observable<number[]>;
    private uint8ArrayToArray(input);
}
