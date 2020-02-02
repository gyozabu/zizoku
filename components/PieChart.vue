<script>
import { Pie } from 'vue-chartjs'

export default {
  name: 'PieChart',
  extends: Pie,
  props: {
    chartdata: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {
    this.renderChart(this.chartdata, this.options)
  }
}
</script>
