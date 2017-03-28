import { Observable } from 'data/observable';

import { Drone } from 'nativescript-mambo-ble';
// import { setCharacteristicLogging } from 'nativescript-bluetooth';

export class AllDrones extends Observable {  
  private drones: Array<Drone> = [];

  constructor() {
    super();
    // setCharacteristicLogging(false);
  }

  addDrone(drone: Drone) {
    this.drones.push(drone);
  }

  removeDrone(drone: Drone) {
    var index = this.drones.indexOf(drone);

    if (index > -1) {
      this.drones.splice(index, 1);
    }
  }

  public takeOff() {
    this.drones.forEach( (drone: Drone) => {
      drone.takeOff();
    })
  }

  public land() {
    this.drones.forEach( (drone: Drone) => {
      drone.land();
    })
  }

  public updateFlightParams(roll: number, pitch: number, yaw: number, altitude: number) {
    this.drones.forEach( (drone: Drone) => {
      drone.updateFlightParams(roll, pitch, yaw, altitude);
    })
  }
}

export var ConnectedDrones = new AllDrones();