export declare class DroneCharacteristic {
    private deviceUUID;
    private serviceUUID;
    private characteristicUUID;
    private _steps;
    private readonly steps;
    constructor(deviceUUID: string, serviceUUID: string, characteristicUUID: string);
    private prepareBuffer(params);
    write(command: number[]): Promise<any>;
    writeWithoutResponse(command: number[]): Promise<any>;
    private convertToHexString(code);
}
