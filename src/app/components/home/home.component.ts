import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

declare const L: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    if (!navigator.geolocation){
      console.log('location is not supported');
    }
    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      const latLong = [coords.latitude, coords.longitude];
      console.log('lat: ${position.coords.latitude}, lon: ${position.coords.longitude}');
      let mymap = L.map('map').setView(latLong, 13);

      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={pk.eyJ1IjoiZGFuc3RyZWFrIiwiYSI6ImNsMTlrYjI0bjBuc3EzbHBtb2N3ejRmazMifQ.GD0gnfLfUWAyM_mSSgyzHA}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
      }).addTo(mymap);

      let marker = L.marker(latLong).addTo(mymap);

      marker.bindPopup('<b>Hi</b>').openPop();

      let popup = L.popup()
        .setLatLng(latLong)
        .setContent("I am here.")
        .openOn(mymap);
    });
    this.watchPosition();
  }

  watchPosition(){
    let desLat = 0;
    let desLon = 0;
    let id = navigator.geolocation.watchPosition((position) => {
      console.log('lat: ${position.coords.latitude}, lon: ${position.coords.longitude}');
      if(position.coords.latitude === desLat){
        navigator.geolocation.clearWatch(id);
      }
    }, (err) => {
      console.log(err);
    },{
      enableHighAccuracy:true,
      timeout:5000,
      maximumAge:0
    } );
  }

}
