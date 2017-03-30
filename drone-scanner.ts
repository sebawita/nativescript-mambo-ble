import { startScanning, requestCoarseLocationPermission, hasCoarseLocationPermission, Peripheral, setCharacteristicLogging } from 'nativescript-bluetooth';
import { Observable, Subject, Subscription } from 'rxjs';

import { Drone } from './drone';

export class DroneScanner {

  static scan(): Observable<Drone> {
    setCharacteristicLogging(false);
    this.initialisePermissionsIfRequired();

    const subject = new Subject<Drone>();

    startScanning({
      serviceUUIDs: [],
      seconds: 3,
      onDiscovered: (peripheral: Peripheral) => {

        console.log("");
        console.log("----New Device Found----");
        console.log("Periperhal found with UUID: " + peripheral.UUID);
        console.log("Periperhal found with name: " + peripheral.name);

        if (this.checkIfMambo(peripheral) === false) {
          console.log(`Skipping a non mambo device with UUID: ${peripheral.UUID}`);
          return;
        }
        
        var newDevice = new Drone(peripheral.UUID, peripheral.name);
        subject.next(newDevice);
      }
    })
    .then(() => {
      subject.complete();
    });

    return subject;
  }

  private static checkIfMambo(peripheral: Peripheral) {
    if (peripheral.name === null) {
      return false;
    }

    const namePrefix = peripheral.name.substr(0, 5);
    return namePrefix === 'Mambo';
  }

  static initialisePermissionsIfRequired() {
    this.hasPermissions()
    .then(granted => {
      if (granted == false) {
        console.log("Requesting permissions");
        this.requestPermissions();
      }
    });
  }

  static hasPermissions(): Promise<boolean> {
    return hasCoarseLocationPermission();
  }

  static requestPermissions() {
    requestCoarseLocationPermission().then(
      function () {
        console.log("Location permission requested");
      }
    );
  }
}
