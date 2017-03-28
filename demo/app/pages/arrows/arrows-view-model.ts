import {Observable} from "data/observable";
import {ConnectedDrones} from "../../all-drones";

export class ArrowsViewModel extends Observable {
  public title = "Arrows";

  private _yaw: number = 0;
  get yaw() {
    return this._yaw;
  }
  set yaw(val: number) {
    this._yaw = Math.round(val);
  }

  private _altitude: number = 0;
  get altitude() {
    return this._altitude;
  }
  set altitude(val: number) {
    this._altitude = Math.round(val);
  }

  public takeOff() {
    ConnectedDrones.takeOff();
  }

  public land() {
    ConnectedDrones.land();
  }

  public updateYaw() {
    ConnectedDrones.updateFlightParams(0, 0, this.yaw/100, 0);
  }
  public updateAltitude() {
    ConnectedDrones.updateFlightParams(0, 0, 0, this.altitude/100);
  }

  public moveForward() {
    // AllDrones.moveForward(this.speed);
  }

  public moveBack() {
    // AllDrones.moveBack(this.speed);
  }

  public turnLeft() {
    // AllDrones.turnLeft(this.speed, this.turnSpeed);
  }

  public turnRight() {
    // AllDrones.turnRight(this.speed, this.turnSpeed);
  }
}

export var arrowsViewModel = new ArrowsViewModel();
