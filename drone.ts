declare var require: any;
var bluetooth = require('nativescript-bluetooth');
import { Observable, BehaviorSubject, Subject, Subscription } from 'rxjs';

// import {codes} from "./codes";
const FLIGHT_STATUSES = ['landed', 'taking off', 'hovering', 'flying',
                         'landing', 'emergency', 'rolling', 'initializing'];

import { DroneCharacteristic } from './drone-characteristic';
import { DroneNotificationsCharacteristic } from './drone-notifications-characteristic';

export class Drone  {
  private flightCommandInstructions: DroneCharacteristic;
  private flightParamsInstructions: DroneCharacteristic;
  private flightStatus: DroneNotificationsCharacteristic;
  private batteryStatus: DroneNotificationsCharacteristic;

  private roll: number = 0;
  private pitch: number = 0;
  private yaw: number = 0;
  private altitude: number = 0;

  private flightLoopHandle: number = -1;

  private flightStatusSubject: BehaviorSubject<string>;
  private batteryStatusSubject: BehaviorSubject<number>;

  constructor(public UUID: string, public name: string) {
    this.flightStatusSubject = new BehaviorSubject(FLIGHT_STATUSES[0]);
    this.batteryStatusSubject = new BehaviorSubject(100);
  }

  public connect(disconnectFn: (DroneController) => any): Promise<Drone> {
    return new Promise((resolve, reject) => {
      bluetooth.connect({
        UUID: this.UUID,
        onConnected: ((peripheral) => {
          console.log("Periperhal connected with UUID: " + peripheral.UUID);

          this.initialize();

          resolve(this);
        }),
        onDisconnected: (peripheral) => {
          this.onDisonnected();

          if (disconnectFn) {
            disconnectFn(this);
          }
          alert("Device disconnected");
        }
      });
    })
  }

  public disconnect() {
    return bluetooth.disconnect({ UUID: this.UUID });
  }

  private onDisonnected() {
    this.stopFlightLoop();

    this.stopListeningToFlightStatus();
    // this.stopListeningToBatteryStatus();
  }

  private initialize() {
    this.flightCommandInstructions = new DroneCharacteristic(this.UUID, 'fa00', 'fa0b');
    this.flightParamsInstructions = new DroneCharacteristic(this.UUID, 'fa00', 'fa0a');
    this.flightStatus = new DroneNotificationsCharacteristic(this.UUID, 'fb00', 'fb0e');
    this.batteryStatus = new DroneNotificationsCharacteristic(this.UUID, 'fb00', 'fb0f');

    this.setMaxAltitude(5)        // 2m
    .then(() => this.setMaxTilt(40))          // 40% (20° max)
    .then(() => this.setMaxVerticalSpeed(0))   // 0.5 m/s
    .then(() => this.setMaxRotationSpeed(150)) // 150 °/s
    .then(() => {
      this.listenToFlightStatus()
      // .then(() => this.listenToBatteryStatus())
      
      this.startFlightLoop(); 
    })
    .catch(reason => {
      console.log('failed to initialize: ' + JSON.stringify(reason))
    });
  }
  
  /**
   * Convenience method for setting the drone's altitude limitation
   * @param  {Integer} altitude the altitude in meters (2m-10m for Airborne Cargo / 2m - 25m for Mambo)
   */
  setMaxAltitude(maxAltitude: number): Promise<any> {
    console.log('setMaxAltitude: ' + maxAltitude);
    maxAltitude = this.ensureBoundaries(maxAltitude, 2, 25);

    return this.flightCommandInstructions.write([8, 0, 0, maxAltitude, 0]);
  }

  /**
   * Convenience method for setting the drone's max tilt limitation
   * @param  {integer} tilt The max tilt from 0-100 (0 = 5° - 100 = 20°)
   */
  setMaxTilt(maxTilt: number): Promise<any> {
    console.log('setMaxTilt: ' + maxTilt);
    maxTilt = this.ensureBoundaries(maxTilt, 0, 100);

    return this.flightCommandInstructions.write([8, 1, 0, maxTilt, 0]);
  }

  /**
   * Convenience method for setting the drone's max vertical speed limitation
   * @param  {integer} verticalSpeed The max vertical speed from 0.5m/s - 2m/s
   */
  setMaxVerticalSpeed(maxVerticalSpeed: number): Promise<any> {
    console.log('setMaxVerticalSpeed: ' + maxVerticalSpeed);
    maxVerticalSpeed = this.ensureBoundaries(maxVerticalSpeed, 0, 100);

    return this.flightCommandInstructions.write([1, 0, 0, maxVerticalSpeed, 0]);
  }

  /**
   * Convenience method for setting the drone's max rotation speed limitation
   * @param  {integer} tilt The max rotation speed from (50°-360° for Airborne Cargo / 50° - 180° for Mambo)
   */
  setMaxRotationSpeed(maxRotationSpeed: number): Promise<any> {
    console.log('setMaxRotationSpeed: ' + maxRotationSpeed);
    maxRotationSpeed = this.ensureBoundaries(maxRotationSpeed, 50, 180);

    return this.flightCommandInstructions.write([1, 1, 0, maxRotationSpeed, 0]);
  }

  listenToFlightStatus() {
    const promise = this.flightStatus.startNotifying();

    this.flightStatus.getObservable().subscribe((notificationData: number[]) => {
      this.updateFlightStatus(notificationData);
    });

    return promise;
  }

  updateFlightStatus(notificationData: number[]) {
    if (notificationData[2] !== 2) {
      return;
    }

    const status = FLIGHT_STATUSES[notificationData[6]];
    this.flightStatusSubject.next(status);

    console.log('updateFlightStatus::' + status);
  }

  stopListeningToFlightStatus() {
    if (this.flightStatus) {
      this.flightStatus.stopNotifying();
    }
  }

  listenToBatteryStatus() {
    const promise = this.batteryStatus.startNotifying();

    this.batteryStatus.getObservable().subscribe((notificationData: number[]) => {
      this.updateBatteryStatus(notificationData);
    });

    return promise;
  }

  updateBatteryStatus(notificationData: number[]) {
    const status = notificationData[notificationData.length-1];
    this.batteryStatusSubject.next(status);

    console.log('updateBatteryStatus::' + status);
  }

  stopListeningToBatteryStatus() {
    this.batteryStatus.stopNotifying();
  }

  startFlightLoop() {
    this.flightLoopHandle = setInterval(() => {
      const command = [0, 2, 0, 1, this.roll, this.pitch, this.yaw, this.altitude, 0, 0, 0, 0, 0, 0, 0, 0]
      this.flightParamsInstructions.writeWithoutResponse(command);
    }, 100);
  }

  stopFlightLoop() {
    if (this.flightLoopHandle > 0) {
      clearInterval(this.flightLoopHandle);
      this.flightLoopHandle = -1;
    }
  }

  public takeOff() {
    this.flightCommandInstructions.writeWithoutResponse([0, 1, 0]);
  }

  public land() {
    this.flightCommandInstructions.writeWithoutResponse([0, 3, 0]);

    this.roll = 0;
    this.pitch = 0;
    this.yaw = 0;
    this.altitude = 0;
  }

  public fire() {
    this.flightCommandInstructions.writeWithoutResponse([16, 2, 0, 0, 0, 0, 0, 0]);
  }

  public updateFlightParams(roll: number, pitch: number, yaw: number, altitude: number) {
    this.setRoll(roll);
    this.setPitch(pitch);
    this.setYaw(yaw);
    this.setAltitude(altitude);
  }

  /**
   * Sets the roll speed of drone's flight params
   * @param roll turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)
   */
  public setRoll(roll) {
    this.roll = this.convertToInputValue(roll);
  }

  /**
   * Sets the pitch of drone's flight params
   * @param pitch turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)
   */
  public setPitch(pitch) {
    this.pitch = this.convertToInputValue(pitch);
  }

  /**
   * Sets the turn speed of drone's flight params
   * @param yaw turn speed, expected value from -1 (turn counter-clocwise) to 1 (turn clocwise)
   */
  public setYaw(yaw: number) {
    this.yaw = this.convertToInputValue(yaw);
  }

  /**
   * Sets the altitude of drone's flight params
   * @param altitude turn speed, expected value from -1 (move down) to 1 (move up)
   */
  public setAltitude(altitude) {
    this.altitude = this.convertToInputValue(altitude);
  }

  private convertToInputValue(value: number) {
    value = this.ensureBoundaries(value, -1, 1);

    if (value >= 0) {
      return Math.round(value * 127);
    } else {
      return 255 + Math.round(value*127);
    }
  }

  private ensureBoundaries(val: number, min: number, max: number) {
    if(val < min) {
      return min;
    }

    if(val > max) {
      return max;
    }

    return val;
  }

  // private ensureBoundariesRound(val: number, min: number, max: number) {
  //   return Math.round(this.ensureBoundaries(val, min, max))
  // }
}
