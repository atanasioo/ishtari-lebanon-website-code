import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import Cookies from "js-cookie";
import { ImLocation } from "react-icons/im";
import { MdLocationOn } from "react-icons/md";
import Geocode from "react-geocode";

function GoogleMap(props) {
  const { position, handlePosition, countryCorrect, handleProps } = props;
  const [showError, setShowError] = useState(false);
  const [err, setErr] = useState(false);
  const [key, setKey]= useState(0);
  const [onChange, setOnChange]= useState(false);

  const AnyReactComponent = () => (
    <div
      className="text-2xl text-dbase"
      // style={{
      //   width: "50px",
      //   height: "50px",
      //   position: "relative",
      //   top: "-50px",
      //   left: "-25px",
      // }}
    >
      <MdLocationOn />
    </div>
  );

  useState(()=>{
    setKey((prev) => prev +1);
  },[onChange])

  // const AnyReactComponent = ({ text }) => <div>hii</div>;

  const defaultProps = {
    center: {
      lat:
        // window.location.host === "www.ishtari.com.gh" ||
        // window.location.host === "ishtari.com.gh" ||
        Cookies.get("site-local-name") === "ishtari-ghana"
          ? 7.8159465
          : 33.8547,
      lng:
        // window.location.host === "www.ishtari.com.gh" ||
        // window.location.host === "ishtari.com.gh" ||
        Cookies.get("site-local-name") === "ishtari-ghana"
          ? -1.189375
          : 35.8623,
    },
    zoom: 8,
  };

  const getMapOptions = (maps) => {
    // console.log(maps);
    return {
      streetViewControl: false,
      scaleControl: true,
      fullscreenControl: false,
      styles: [
        {
          featureType: "road",
          elementType: "all",
          stylers: [
            {
              visibility: "on",
            },
          ],
        },
      ],
      gestureHandling: "cooperative",
      disableDoubleClickZoom: true,
      minZoom: 6,
      maxZoom: 16,
      mapDataProviders: "",
      mapTypeControl: true,
      mapTypeId: maps.MapTypeId.ROADMAP,
      mapTypeControlOptions: {
        style: maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: maps.ControlPosition.RIGHT_BOTTOM,
        mapTypeIds: [],
      },
      zoomControl: false,
      clickableIcons: false,
    };
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 9000,
    maximumAge: 0,
  };

  const locateMe = () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  function success(pos) {
    const crd = pos.coords;
    handlePosition(crd.latitude, crd.longitude);
  }

  function error(err) {
    console.log(`ERROR(${err.code}): ${err.message}`);
  }

  const getLocation = () => {
    Geocode.setApiKey("AIzaSyCK_SKtHBGWHuxNCmRDOCN6J6bWKe4DF8Y");
    Geocode.setLocationType("GEOMETRIC_CENTER");
    Geocode.fromLatLng(position.lat, position.lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        let country;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }

        if (
          window.location.host === "www.ishtari.com" ||
          window.location.host === "ishtari.com" ||
          window.location.host === "next.ishtari.com" ||
          (Cookies.get("site-local-name") === "ishtari" &&
            country === "Lebanon") ||
          window.location.host === "www.ishtari.com.gh" ||
          window.location.host === "ishtari.com.gh" ||
          (Cookies.get("site-local-name") === "ishtari-ghana" &&
            country === "Ghana")
        ) {
          handleProps("countryCorrect", true);
          handleProps("googleLocation", true);
          //   setIsEdit(window.location.href.indexOf("edit") > 0);
        } else {
          handleProps("countryCorrect", false);
          setShowError(true);
        }

        handleProps("confirmedLocation", address);
      },
      (error) => {
        console.error(error);
      }
    );
  };


  return (
    <div className="my-4 relative h-full">
      <div className="relative" style={{ height: "500px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyCK_SKtHBGWHuxNCmRDOCN6J6bWKe4DF8Y",
          }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          options={(o) => getMapOptions(o)}
          onClick={(e) => handlePosition(e.lat, e.lng)}
          onGoogleApiLoaded={({ map, maps }) => console.log("")}
          yesIWantToUseGoogleMapApiInternals
          center={position.lat !== 0 && [position.lat, position.lng]}
          onChange={(center, zoom, bounds, marginBounds) => {
       
            // handlePosition(position.lat, position.lng);
            setOnChange(!onChange)
            
            console.log(center);
          }}
        >
          <AnyReactComponent key ={key} lat={position.lat} lng={position.lng} />
        </GoogleMapReact>
        <div
          className={`block p-1 bottom-0 right-0 mobile:absolute z-10 mobile:p-5`}
        >
          <button
            disabled={position.lat > 0 ? false : true}
            className={`rounded px-8 uppercase w-full block relative overflow-hidden text-sm ${
              position.lat > 0 ? "bg-dblue" : "bg-dgrey"
            } font-bold h-12 ${
              position.lat > 0
                ? "cursor-pointer"
                : "pointer-events-none cursor-default"
            }`}
            style={{
              background:
                position.lat > 0 ? "rgb(56,102,223)" : "rgb(240,241,244)",
              color: position.lat > 0 ? "white" : "rgb(203,207,215)",
            }}
            onClick={() => {
              getLocation();
            }}
          >
            Confirm location
          </button>
        </div>

        {!countryCorrect && showError && (
          <div
            className={`${"mobile:absolute mobile:p-5 block p-1"} bottom-0 right-52 `}
          >
            <div
              disabled={position.lat > 0 ? false : true}
              className={`rounded pl-8 pr-4 uppercase w-full relative overflow-hidden text-sm font-bold h-12 bg-dbase text-center flex gap-4 items-center text-white`}
            >
              Outside of our service area
              <button
                onClick={() => {
                  setShowError(false);
                }}
              >
                X
              </button>
            </div>
          </div>
        )}

        <div
          className={`absolute bottom-0 
              right-0 p-1 mobile:left-0 mobile:p-5 
              `}
        >
          <button
            className={`rounded-full bg-white
                h-8 text-xs px-2 mobile:h-10 mobile:px-4 mobile:text-sm
               border uppercase  block relative overflow-hidden pr-bold cursor-pointer`}
            style={{
              color: "#424452",
            }}
            onClick={() => {
              locateMe();
            }}
          >
            <span className="flex justify-center items-center gap-1">
              <ImLocation />
              Locate Me
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoogleMap;
