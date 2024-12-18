<!-- vue2 使用的 TMap 修改点聚合样式 -->
<template>
  <div id="mapContainer"></div>
</template>

<script>
import ClusterBubble from './ClusterBubble';
export default {
  name: "ClusterMap",
  data() {
    return {
      map: null,
      clusterBubbleList: [],
      markerGeometries: [],
      marker: null,
      markerCluster: null,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const center = new TMap.LatLng(39.953416, 116.380945);
      
      this.map = new TMap.Map("mapContainer", {
        zoom: 11,
        pitch: 40,
        center: center,
      });

      this.markerCluster = new TMap.MarkerCluster({
        id: "cluster",
        map: this.map,
        enableDefaultStyle: false,
        minimumClusterSize: 3,
        geometries: [
          { position: new TMap.LatLng(39.953416, 116.480945) },
          { position: new TMap.LatLng(39.984104, 116.407503) },
          { position: new TMap.LatLng(39.908802, 116.497502) },
          { position: new TMap.LatLng(40.040417, 116.373514) },
          { position: new TMap.LatLng(39.953416, 116.380945) },
          { position: new TMap.LatLng(39.984104, 116.307503) },
          { position: new TMap.LatLng(39.908802, 116.397502) },
          { position: new TMap.LatLng(40.040417, 116.273514) },
        ],
        zoomOnClick: true,
        gridSize: 60,
        averageCenter: false,
      });

      this.markerCluster.on("cluster_changed", this.handleClusterChanged);
    },
    handleClusterChanged() {
      // 清除旧的聚合簇覆盖物
      if (this.clusterBubbleList.length) {
        this.clusterBubbleList.forEach((item) => {
          item.destroy();
        });
        this.clusterBubbleList = [];
      }

      this.markerGeometries = [];
      const clusters = this.markerCluster.getClusters();

      clusters.forEach((item) => {
        if (item.geometries.length > 1) {
          const clusterBubble = new ClusterBubble({
            map: this.map,
            position: item.center,
            content: item.geometries.length,
          });
          clusterBubble.on("click", () => {
            this.map.fitBounds(item.bounds);
          });
          this.clusterBubbleList.push(clusterBubble);
        } else {
          this.markerGeometries.push({
            position: item.center,
          });
        }
      });

      if (this.marker) {
        this.marker.setGeometries(this.markerGeometries);
      } else {
        this.marker = new TMap.MultiMarker({
          map: this.map,
          styles: {
            default: new TMap.MarkerStyle({
              width: 34,
              height: 42,
              anchor: { x: 17, y: 21 },
              src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/marker_blue.png",
            }),
          },
          geometries: this.markerGeometries,
        });
      }
    },
  },
};

window.ClusterBubble = ClusterBubble;
</script>

<style lang="scss" scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  height: 100%;
}

#mapContainer {
  position: relative;
  height: 100%;
  width: 100%;
}

::v-deep .clusterBubble {
  border-radius: 50%;
  color: #fff;
  font-weight: 500;
  text-align: center;
  opacity: 0.88;
  background-image: linear-gradient(139deg, #4294FF 0%, #295BFF 100%);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
}
</style>
