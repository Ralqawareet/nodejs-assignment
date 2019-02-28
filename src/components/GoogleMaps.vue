<template>
  <div :style="{ width: 500 + 'px', height: 500 + 'px' }">
    <LMap
      style="height: 80%; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-moving-marker :lat-lng="markerLatLng" :duration="250" :keepAtCenter="true"></l-moving-marker>
    </LMap>
  </div>
</template>

<script>
import { L, LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import LMovingMarker from "vue2-leaflet-movingmarker";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("../assets/bus.png"),
//   iconUrl: require("../assets/bus.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png")
// });

export default {
  name: "googleMaps",
  props: ["coords"],
  data: function() {
    return {
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      zoom: 3,
      center: [47.41322, -1.219482],
      bounds: null
    };
  },
  computed: {
    markerLatLng: function() {
      return this.coords.length > 0
        ? L.latLng(...this.coords)
        : L.latLng(...this.center);
    }
  },
  methods: {
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
      this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    }
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LMovingMarker
  }
};
</script>

<style>
</style>
