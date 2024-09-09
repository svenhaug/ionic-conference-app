import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class RadiusServiceService {

  km_search: any;

  latitude: any; 
  longitude: any;
  new_lat_from: any;
  new_lat_to: any;
  new_long_from: any;
  new_long_to: any;

  constructor(
    public storage: Storage,
  ) { }


  async calcradius(latitude, longitude, umkreis, from)
  {

    this.latitude = latitude;
    this.longitude = longitude;
    this.km_search = umkreis;

    var distancenumber: number = 0;
    distancenumber = this.km_search;
    distancenumber = distancenumber * 1000; //in km
    var d = 200.0;
    var R = 6371.0;
    var brng = -90;

    const φ2 = Math.asin( Math.sin(this.latitude)*Math.cos(d/R) + Math.cos(this.latitude)*Math.sin(d/R)*Math.cos(brng));
    const λ2 = this.longitude + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(this.latitude),Math.cos(d/R)-Math.sin(this.latitude)*Math.sin(φ2));

    this.new_lat_to = this.latitude - φ2;
    this.new_lat_from = this.latitude + φ2;
    this.new_long_to = this.longitude - λ2;
    this.new_long_from = this.longitude + λ2;
   
    var dist = distancenumber;

    var a = this.toRad(90);  // degrees
    var lat0 = Math.cos(Math.PI / 180.0 * this.latitude);
    var x_long_from = this.longitude + (180/Math.PI) * (dist / 6378137)/Math.cos(lat0) * Math.cos(a);
    var y_lat_from = this.latitude + (180/Math.PI) * (dist / 6378137) * Math.sin(a);
    var final_lat_from = y_lat_from;

    a = this.toRad(-90);
    var x_long_to = this.longitude + (180/Math.PI) * (dist / 6378137)/Math.cos(lat0) * Math.cos(a);
    var y_lat_to = this.latitude + (180/Math.PI) * (dist / 6378137) * Math.sin(a);
    var final_lat_to = y_lat_to;

    a = this.toRad(0);  // degrees
    var lat0 = Math.cos(Math.PI / 180.0 * this.latitude);
    var x_long_from = this.longitude + (180/Math.PI) * (dist / 6378137)/Math.cos(lat0) * Math.cos(a);
    var y_lat_from = this.latitude + (180/Math.PI) * (dist / 6378137) * Math.sin(a);
    var final_long_from = x_long_from;

    a = this.toRad(180);
    var x_long_to = this.longitude + (180/Math.PI) * (dist / 6378137)/Math.cos(lat0) * Math.cos(a);
    var y_lat_to = this.latitude + (180/Math.PI) * (dist / 6378137) * Math.sin(a);
    var final_long_to = x_long_to;
    
    this.new_lat_from = final_lat_from;
    this.new_lat_to = final_lat_to;
    this.new_long_from = final_long_from;
    this.new_long_to = final_long_to;
    /*
    console.log('distancenumber: ' + distancenumber);
    console.log('alte Long: ' + this.longitude);
    console.log('neue Long: ' + λ2);
    console.log('alte lat: ' + this.latitude);
    console.log('neue Lat from: ' + this.new_lat_from);
    console.log('neue Lat to: ' + this.new_lat_to);
    console.log('neue Long from: ' + this.new_long_from);
    console.log('neue Long to: ' + this.new_long_to);
    */
    this.storage.set(from+'_latitude', latitude);
    this.storage.set(from+'_longitude', longitude);
    this.storage.set(from+'_lat_from', this.new_lat_from);
    this.storage.set(from+'_lat_to', this.new_lat_to);
    this.storage.set(from+'_lng_from', this.new_long_from);
    this.storage.set(from+'_lng_to', this.new_long_to);
    
  }

  degrees_to_radians(degrees)
  {
    var pi = Math.PI;
    return degrees * (pi/180);
  }
  
  toRad = function(r) {
    return r * Math.PI / 180;
  }

  toDeg = function(d) {
    return d * 180 / Math.PI;
  }

}
