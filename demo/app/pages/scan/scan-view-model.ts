import { ObservableArray } from 'data/observable-array';
import frameModule = require('ui/frame');
import { DroneScanner, Drone } from 'nativescript-mambo-ble';

import { RadListView, ListViewEventData } from 'nativescript-telerik-ui/listview';
import { ConnectedDrones } from '../../connected-drone';

export class ScanViewModel {
  public title = 'Scanner';

  private listView: RadListView;
  public devicesAround: ObservableArray<Drone>;

   constructor() {
    DroneScanner.initialisePermissionsIfRequired();

    this.devicesAround = new ObservableArray<Drone>();
    this.devicesAround.push(new Drone('B4:99:4C:48:14:24', 'Test'));
  }

  public getPermissions() {
    DroneScanner.initialisePermissionsIfRequired();
  }

  public connect(args) {
    var drone: Drone = this.devicesAround.getItem(args.itemIndex);
    drone.connect(this.onDisconnected)
    .then((UUID) => {
      ConnectedDrones.setDrone(drone);
      alert('Device Connected');
    })
  }

  public scan(eventData: ListViewEventData) {
    this.listView = eventData.object;

    this.devicesAround.splice(0);

    DroneScanner.scan()
    .subscribe(
      (drone: Drone) => this.onDroneFound(drone),
      error => {
        console.log('error while scanning: ' + error);
        this.onScanFinished();
      },
      () => this.onScanFinished()
    )
  }

  private onScanFinished() {
    if (this.listView) {
      this.listView.notifyPullToRefreshFinished();
    }
  }

  private onDroneFound(drone: Drone) {
    scanViewModel.devicesAround.push(drone);
  }

  private onDisconnected(drone: Drone) {
    ConnectedDrones.removeDrone();
  }
}

export var scanViewModel = new ScanViewModel();