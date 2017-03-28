import { writeWithoutResponse, write } from 'nativescript-bluetooth';

export class DroneCharacteristic {
  private serviceUUID: string;
  private characteristicUUID: string;

  private _steps = 0;
  private get steps(): number {
    if (++this._steps > 255) {
      this._steps = 0;
    }

    return this._steps;
  }

  constructor(private deviceUUID: string, serviceUUID: string, characteristicUUID: string) {
    this.serviceUUID = '9a66' + serviceUUID + '-0800-9191-11e4-012d1540cb8e';
    this.characteristicUUID = '9a66' + characteristicUUID + '-0800-9191-11e4-012d1540cb8e';
  }

  private prepareBuffer(params: number[]) {
    const buffer = '0x02,0x' + this.steps.toString(16) + ',0x02,';

    const instructionParams = params.map(param => {
      return this.convertToHexString(param);
    }).join(',');

    return buffer + instructionParams;
  }

  write(command: number[]): Promise<any> {
    const value = this.prepareBuffer(command);
    // console.log(`write serv: ${this.serviceUUID} char: ${this.characteristicUUID} instr: ${value}`);

    var bluetoothOptions: any = {
      peripheralUUID: this.deviceUUID,
      serviceUUID: this.serviceUUID,
      characteristicUUID: this.characteristicUUID,
      value: value
    }

    return write(bluetoothOptions);
  }

  writeWithoutResponse(command: number[]): Promise<any> {
    const value = this.prepareBuffer(command);
    // console.log(`write serv: ${this.serviceUUID} char: ${this.characteristicUUID} instr: ${value}`);

    var bluetoothOptions: any = {
      peripheralUUID: this.deviceUUID,
      serviceUUID: this.serviceUUID,
      characteristicUUID: this.characteristicUUID,
      value: value
    }

    return writeWithoutResponse(bluetoothOptions);
  }

  private convertToHexString(code: number): string {
    code = Math.round(code);
      return '0x' + code.toString(16);
  }
}