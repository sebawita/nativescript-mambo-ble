import { Observable } from "data/observable";
import { startAccelerometerUpdates, stopAccelerometerUpdates } from "nativescript-accelerometer"

import { ConnectedDrones } from "../../all-drones";

export class AccelerometerViewModel extends Observable {
  public title = "Accelerometer";

  private altitude: number = 0;
  private yaw: number = 0;
  private roll: number = 0;
  private pitch: number = 0;

  private accelerometerActive: boolean = false;

  private loop: number = null;

  public startAccelerometer() {
    ConnectedDrones.takeOff();

    if (this.accelerometerActive) {
      return;
    }
    
    this.accelerometerActive = true;

    startAccelerometerUpdates(data => {
      this.pitch = data.y /2; // fly backward (0 to -1) / fly forward (0 to 1)
      this.yaw = data.x /2; // turn left (0 to -1) / turn right (0 to 1)
    })

    this.startContinousMove();
  }

  public stopAccelerometer() {
    ConnectedDrones.land();

    if (this.accelerometerActive) {
      stopAccelerometerUpdates();
      this.accelerometerActive = false;
      this.stopContinousMove();
    }
  }

  public startContinousMove() {
    if (this.loop) {
      return;
    }

    this.loop = setInterval(() => {
      ConnectedDrones.updateFlightParams(this.roll, this.pitch, this.yaw, this.altitude);
    }, 100);
  }

  public stopContinousMove() {
    clearInterval(this.loop);
    this.loop = null;
  }
}

export var accelerometerViewModel = new AccelerometerViewModel();
