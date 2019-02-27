<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
console.log(reactiveProp);
export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ["width", "height", "chart-id", "options"],
  data: function() {
    return {};
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
  }
};
</script> 
<style>
</style>
