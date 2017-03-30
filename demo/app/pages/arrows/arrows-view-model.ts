import {Observable} from "data/observable";
import {ConnectedDrones} from "../../connected-drone";

export class ArrowsViewModel extends Observable {
  public title = "Arrows";

  private _speed: number = 30;
  get speed() {
    return this._speed;
  }
  set speed(val: number) {
    this._speed = Math.round(val);
  }

  public takeOff() {
    ConnectedDrones.drone.takeOff();
  }

  public land() {
    ConnectedDrones.drone.land();
  }

  public fire() {
    ConnectedDrones.drone.fire();
  }

  private clearTimeout(handle) {
    if (handle > 0) {
      clearTimeout(handle);
      handle = -1;
    }
  }

  public rollLeft() {
    ConnectedDrones.drone.setRoll(-this.speed);
    setTimeout(() => ConnectedDrones.drone.setRoll(0), 500)
  }
  public rollRight() {
    ConnectedDrones.drone.setRoll(this.speed);
    setTimeout(() => ConnectedDrones.drone.setRoll(0), 500)
  }

  public pitchForward() {
    ConnectedDrones.drone.setPitch(this.speed);
    setTimeout(() => ConnectedDrones.drone.setPitch(0), 500)
  }
  public pitchBack() {
    ConnectedDrones.drone.setPitch(-this.speed);
    setTimeout(() => ConnectedDrones.drone.setPitch(0), 500)
  }

  public yawLeft() {
    ConnectedDrones.drone.setYaw(-this.speed);
    setTimeout(() => ConnectedDrones.drone.setYaw(0), 500)
  }
  public yawRight() {
    ConnectedDrones.drone.setYaw(this.speed);
    setTimeout(() => ConnectedDrones.drone.setYaw(0), 500)
  }

  public altitudeUp() {
    ConnectedDrones.drone.setAltitude(this.speed);
    setTimeout(() => ConnectedDrones.drone.setAltitude(0), 500)
  }
  public altitudeDown() {
    ConnectedDrones.drone.setAltitude(-this.speed);
    setTimeout(() => ConnectedDrones.drone.setAltitude(0), 500)
  }

}

export var arrowsViewModel = new ArrowsViewModel();
