import { startScanning, requestCoarseLocationPermission, hasCoarseLocationPermission, Peripheral } from 'nativescript-bluetooth';
import { Observable, Subject, Subscription } from 'rxjs';

import { Drone } from './drone';

export class DroneScanner {

  // constructor() {
  //   this.initialisePermissionsIfRequired();
  // }

  static scan(): Observable<Drone> {
    this.initialisePermissionsIfRequired();

    const subject = new Subject<Drone>();

    startScanning({
      serviceUUIDs: [],
      seconds: 3,
      onDiscovered: (peripheral: Peripheral) => {
      // if (this.checkIfMambo(peripheral) === false) {
        // console.log(`Skipping a non mambo device with UUID: ${peripheral.UUID} and advertisement: ${peripheral.advertisement}`);
        // return;
      // }

        console.log("");
        console.log("----New Device Found----");
        console.log("Periperhal found with UUID: " + peripheral.UUID);
        console.log("Periperhal found with name: " + peripheral.name);
        // console.log("Periperhal found with advertisement: " + peripheral.advertisement);

        // var newDevice = new DroneController(peripheral.UUID, peripheral.name, peripheral.state);
        var newDevice = new Drone(peripheral.UUID, peripheral.name);

        subject.next(newDevice);
      }
    })
    .then(() => {
      subject.complete();
    });

    return subject;
  }
/*
  static checkIfMambo(periperhal: any) {
    const advert = base64_decode(periperhal.advertisement);

    // check if a WowWee device
    //  Wowwee has a code 0x03FO, they are listed as CLINK at https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers
    //  the code should be stored as advert[4] => O3 and advert[5] => F0

    // if (advert[4] !== 0x03 || advert[5] !== 0xF0) {
            //     // this is not a Wowwee device
    //     // return false;
    //     console.log("Is this a WowWee device?: " + advert.toString());
    // }

    // check if mambo, all mambo have the 4th digit set to 5
    return (advert.length > 3 && advert[3] === 5);
  }
*/
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

const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

function base64_decode(input: string): Array<number> {
const orig_input = input;
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  if (orig_input != input)
    console.error("Warning! Characters outside Base64 range in input string ignored.");
  if (input.length % 4) {
    console.error("Error: Input length is not a multiple of 4 bytes.");
    return [];
  }

  const output: Array<number> = [];

  let i=0;
  while (i < input.length) {
    const enc1 = keyStr.indexOf(input.charAt(i++));
    const enc2 = keyStr.indexOf(input.charAt(i++));
    const enc3 = keyStr.indexOf(input.charAt(i++));
    const enc4 = keyStr.indexOf(input.charAt(i++));

    const chr1 = (enc1 << 2) | (enc2 >> 4);
    const chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
    const chr3 = ((enc3 & 3) << 6) | enc4;
    
    output.push(chr1);
    if (enc3 != 64) {
      output.push(chr2);
    }
    if (enc4 != 64) {
      output.push(chr3);
    };
  }
  return output;
}