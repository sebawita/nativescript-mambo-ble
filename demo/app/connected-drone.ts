
import { Drone } from 'nativescript-mambo-ble';
// import { setCharacteristicLogging } from 'nativescript-bluetooth';

export class ConnectedDrone {  
  private _drone: Drone = null;

  get drone(): Drone {
    return this._drone;
  }

  setDrone(drone: Drone) {
    this._drone = drone;
  }

  removeDrone() {
    this._drone = null;
  }

  isDroneConnected() {
    return this._drone !== null;
  }

}

export var ConnectedDrones = new ConnectedDrone();