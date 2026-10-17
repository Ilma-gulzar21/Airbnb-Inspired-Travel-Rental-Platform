
console.log("WanderLust Map Starting...");
// LISTING COORDINATES FROM DATABASE

const listingGeometry = <%- JSON.stringify(listing.geometry || null) %>;

let listingLatitude = 20.5937;
let listingLongitude = 78.9629;

// CHECK SAVED COORDINATES
if (
  listingGeometry &&
  listingGeometry.coordinates &&
  listingGeometry.coordinates.length >= 2
) {

  listingLongitude =
    Number(listingGeometry.coordinates[0]);

  listingLatitude =
    Number(listingGeometry.coordinates[1]);

}

console.log(
  "Listing Latitude:",
  listingLatitude
);

console.log(
  "Listing Longitude:",
  listingLongitude
);



// MAP
const map = L.map("map", {
  zoomControl: false
}).setView(

  [
    listingLatitude,
    listingLongitude
  ],

  listingGeometry ? 15 : 5

);

// OPEN STREET MAP
L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

  {maxZoom: 19,attribution:"&copy; OpenStreetMap contributors"}
).addTo(map);

// ZOOM CONTROL
L.control.zoom({position: "bottomright"}).addTo(map);

// CUSTOM LISTING ICON

const customIcon = L.divIcon({
  className: "custom-map-marker",
  html: `
    <div class="marker-pin">
      <i class="fa-solid fa-house"></i>
    </div>
  `,
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45]
});

// LISTING MARKER
const listingMarker = L.marker(
  [listingLatitude,listingLongitude],
  {icon: customIcon}
)

.addTo(map)
.bindPopup(`
  <div class="map-popup">
    <div class="popup-icon">
      <i class="fa-solid fa-house"></i>
    </div>

    <div class="popup-content">
      <h6>
        <%= listing.title %>
      </h6>


      <p>
        <i class="fa-solid fa-location-dot"></i>
        <%= listing.location %>
      </p>


      <small>
        <%= listing.country %>
      </small>
    </div>
  </div>
`);
listingMarker.openPopup();

// SHARE LISTING
async function shareListing() {
  const shareData = {
    title:"<%= listing.title %>",
    text: "Check out this amazing place on WanderLust!",
    url:window.location.href
  };


  try {
    if (navigator.share) {
      await navigator.share(shareData);
    }else {

      await navigator.clipboard.writeText(
        window.location.href
      );

      const message =
        document.getElementById(
          "share-message"
        );

      message.innerText =
        "✓ Link copied!";
      setTimeout(() => {
        message.innerText = "";
      }, 2500);
    }
  }
  catch (error) {
    console.log("Share cancelled");
  }
}
// LIVE LOCATION
const locateBtn = document.getElementById("locate-btn");
const locationStatus = document.getElementById("location-status");
const footerLocation = document.getElementById("footer-location");
let userMarker = null;
let accuracyCircle = null;

// GET CURRENT LOCATION
locateBtn.addEventListener(
  "click",
  () => {
    if (!navigator.geolocation) {
      locationStatus.innerText =
        "Geolocation is not supported by your browser.";
      return;

    }
    locateBtn.disabled = true;
    locateBtn.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Finding Location...
    `;
    locationStatus.innerText =
      "Requesting your current location...";
    navigator.geolocation.getCurrentPosition(
      (position) => {


        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;


        console.log(
          "User Latitude:",
          latitude
        );

        console.log(
          "User Longitude:",
          longitude
        );

        // MOVE MAP TO USER
        map.setView(
          [latitude,longitude],
          16,
          {animate: true}
        );

        // REMOVE OLD USER MARKER
        if (userMarker) { map.removeLayer(userMarker);}
        if (accuracyCircle) {
          map.removeLayer(
            accuracyCircle
          );
        }

        // USER LOCATION MARKER
        userMarker =
          L.circleMarker(

            [
              latitude,
              longitude
            ],

            {

              radius: 9,
              color: "#ffffff",
              weight: 3,
              fillColor: "#4285F4",
              fillOpacity: 1
            }
          )
          .addTo(map);

        // ACCURACY CIRCLE
        accuracyCircle =
          L.circle(
            [
              latitude,
              longitude
            ],

            {

              radius: accuracy,
              color: "#4285F4",
              fillColor: "#4285F4",
              fillOpacity: 0.12,
              weight: 1
            }
          )
          .addTo(map);

        // USER POPUP
        userMarker
          .bindPopup(`
            <div style="text-align:center">
              <strong>
                &#128205; Your Current Location
              </strong>

              <br><br>
              <small>
                Accuracy:
                ±${Math.round(accuracy)} meters
              </small>
            </div>
          `)
          .openPopup();

        // STATUS
        locationStatus.innerText =
          `Location found • Accuracy ±${Math.round(accuracy)}m`;

        // FOOTER
        footerLocation.innerText =
          `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        // BUTTON

        locateBtn.disabled = false;
        locateBtn.innerHTML = `
          <i class="fa-solid fa-location-crosshairs"></i>
          Update My Location
        `;
      },

      // LOCATION ERROR
      (error) => {
        console.error(
          "Location Error:",
          error
        );
        locateBtn.disabled = false;
        locateBtn.innerHTML = `
          <i class="fa-solid fa-location-crosshairs"></i>
          Try Again
        `;


if (error.code === 1) {
    locationStatus.innerHTML =
        "&#10060; Please allow location permission.";
}

        else if (error.code === 2) {
          locationStatus.innerText =
            "&#10060; Location unavailable.";
        }

        else if (error.code === 3) {
          locationStatus.innerText =
            "&#10060; Location request timed out.";
        }

        else {
          locationStatus.innerText =
            "&#10060; Unable to get your location.";
        }
      },

      // GPS OPTIONS
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }
);
console.log(
  "WanderLust Map + Live Location Ready"
);
