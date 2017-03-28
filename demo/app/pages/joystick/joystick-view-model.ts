import { Observable } from "data/observable";

import { ConnectedDrones } from "../../all-drones";

export class JoyStickViewModel extends Observable {
    public title = "JoyStick";

    private altitude: number = 0;
    private yaw: number = 0;
    private roll: number = 0;
    private pitch: number = 0;

    private loop: number = null;

    public startJoystick() {
        ConnectedDrones.takeOff();

        if (this.loop)
            return;

        this.startContinousMove();
    }

    public stopJoystick() {
        ConnectedDrones.land();

        this.set("turnSpeed", 0);
        this.set("speed", 0);
        this.stopContinousMove();
    }

    public startContinousMove() {
        if (this.loop)
            return;

        this.loop = setInterval(() => {
            // if (this.yaw > 1)
            //     this.yaw = 1;
            // else if (this.yaw < -1)
            //     this.yaw = -1;

            // if (this.altitude > 1)
            //     this.altitude = 1;
            // else if (this.altitude < -1)
            //     this.altitude = -1;

            // console.log(`${this.roll}, ${this.pitch}, ${this.yaw}, ${this.altitude}`);

            ConnectedDrones.updateFlightParams(this.roll/2, this.pitch/2, this.yaw, this.altitude/2);

            // if (this.speed > 0 || this.turnSpeed) {
            //   ConnectedDrones.updateFlightParams(0, 0, 0, 70);
            // }

        }, 50);
    }

    public stopContinousMove() {
        clearInterval(this.loop);
        this.loop = null;
    }

}

export var joyStickViewModel = new JoyStickViewModel();
