
var coord = { lat: 28.672929123342804, lng: 77.21112748238275 };
var map;
var mapMarkers = [];


function initMap() {
  const myLatlng = { lat: 28.640552786049202, lng: 77.22074051949213 };
  map = new google.maps.Map(document.getElementById("app-map"), {
    zoom: 10,
    center: myLatlng,
    mapId: "7bd8fe8d2cca9c09",
  });
  // Create the initial InfoWindow.
  let infoWindow = new google.maps.InfoWindow({
    content: "Click the map to set your current location!",
    position: myLatlng,
  });

  let markerOld;
  infoWindow.open(map);
  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow.
    infoWindow.close();
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    if (markerOld) {
      markerOld.setMap(null);
    }
    let marker = new google.maps.Marker({
      position: mapsMouseEvent.latLng,
      title: "My Location",
    });
    markerOld = marker;
    marker.setMap(map);
    infoWindow.setContent(
      JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
    );
    coord = mapsMouseEvent.latLng.toJSON();

    console.log(mapsMouseEvent.latLng.toJSON());
    infoWindow.open(map);
  });
}

window.initMap = initMap;

async function getCity(coord) {
  let response = await fetch(
    "https://us1.locationiq.com/v1/reverse.php?key=pk.a4e046bceeb8a1041d670ec92978115d&lat=" +
      coord.lat +
      "&lon=" +
      coord.lng +
      "&format=json",
    {
      method: "get",
    }
  ).then((res) => res.json());
  return (
    response.address.city ||
    response.address.state_county ||
    response.address.state_district
  );
}

function drawResult(data) {
  return `
               <div class="result">
                  <div class="result-header">
                     <span class="shop-name">${data.shopName}</span>
                     <span class="price">Rs.${data.price}</span>
                  </div>
                  <div class="res-main">
                     <div class="info-section">
                        <span class="med-name">${data.name}</span>
                        <span class="med-catg">${data.category}</span>
                        <div class="mfg">${data.brand}</div>
                     </div>
                     <div class="control-section">
                        <div lat="${data.lat}" lng="${data.lng}" class="direction-btn"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Icons" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
                           <path d="M29.3,10.4l-6.8-6c-0.6-0.4-1.3-0.5-2-0.2c-0.7,0.3-1.1,1-1.1,1.8v1.1C9.5,8.2,2,16.7,2,27c0,0.5,0.3,0.9,0.8,1  c0.1,0,0.1,0,0.2,0c0.4,0,0.8-0.2,0.9-0.6c2.8-6.3,8.8-10.3,15.4-10.4v1c0,0.8,0.4,1.5,1.1,1.8c0.7,0.3,1.4,0.2,2-0.2l6.7-6  c0.5-0.4,0.8-1,0.8-1.6C30,11.4,29.7,10.8,29.3,10.4z"/>
                        </svg></div>
                     </div>
                  </div>
               </div>`;
}

var searchForm = document.getElementById("search-form");
var search = document.getElementById("search");
var axios = require('axios');

if (search){
  search.addEventListener("input", async function (e) {
    console.log("XXXX", e.target.value);
  });
}

if (searchForm){
  searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!coord) {
      return alert("Please set your location.");
    }
    let city = await getCity(coord);
    let response = await fetch("/search", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        q: search.value,
        city,
      }),
    }).then((res) => res.json());
    console.log(response.result);
    let resultSection = document.querySelector(".result-section");
    resultSection.innerHTML = "";
    mapMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    mapMarkers = [];
    response.result.forEach((result) => {
      resultSection.innerHTML += drawResult(result);
      let marker = new google.maps.Marker({
        position: { lat: Number(result.lat), lng: Number(result.lng) },
        title: result.shopName,
        map,
        icon: "/assets/icon_nearmed.svg",
      });
      mapMarkers.push(marker);
    });
    let directionBtns = document.querySelectorAll(".direction-btn");
    directionBtns.forEach((directionBtn) => {
      directionBtn.addEventListener("click", function (e) {
        console.log("clicked");
        let center = {
          lat: Number(this.getAttribute("lat")),
          lng: Number(this.getAttribute("lng")),
        };
        map.setCenter(center);
        map.setZoom(16);
      });
    });
  });
}
