import { startNotifying, stopNotifying, setCharacteristicLogging } from 'nativescript-bluetooth';
import { Observable, Subject, Subscription } from 'rxjs';

export class DroneNotificationsCharacteristic {
  private serviceUUID: string;
  private characteristicUUID: string;

  private subject: Subject<number[]>;
  private distinct: Observable<number[]>;

  constructor(private deviceUUID: string, serviceUUID: string, characteristicUUID: string) {
    this.serviceUUID = '9a66' + serviceUUID + '-0800-9191-11e4-012d1540cb8e';
    this.characteristicUUID = '9a66' + characteristicUUID + '-0800-9191-11e4-012d1540cb8e';
  }

  public startNotifying(): Promise<any> {
    if(this.subject) {
      return new Promise(resolve => resolve());
    }

    setCharacteristicLogging(false)

    const initialValue: number[] = [];
    this.subject = new Subject<number[]>();
    this.distinct = this.subject.distinctUntilChanged();

    const promise = startNotifying({
      peripheralUUID: this.deviceUUID,
      serviceUUID: this.serviceUUID,
      characteristicUUID: this.characteristicUUID,
      onNotify: (codedMessage) => {
        var data = new Uint8Array(codedMessage.value);
        const result = this.uint8ArrayToArray(data);
        // console.log('result: ' + JSON.stringify(result));

        this.subject.next(result);
      }
    })
    // .then(() => console.log(console.log(`startNotifying:: Notification Ready serv: ${this.serviceUUID} char: ${this.characteristicUUID}`)))
    // .catch(reason => console.log('Notification not ready: ' + JSON.stringify(reason)));
    return promise;
  }

  public stopNotifying() {
    if (this.subject) {
      this.subject.complete();
      this.subject = null;

      stopNotifying({
        peripheralUUID: this.deviceUUID,
        serviceUUID: this.serviceUUID,
        characteristicUUID: this.characteristicUUID,
      });
    }
  }

  getObservable(): Observable<number[]> {
    if (!this.subject) {
      this.startNotifying();
    }

    // return this.subject;
    return this.distinct;
  }

  private uint8ArrayToArray(input: Uint8Array): number[] {
    const result: number[] = [];

    for (var i = 0; i < input.byteLength; i++) {
      result.push(input[i]);
    }

    return result;
  }
}