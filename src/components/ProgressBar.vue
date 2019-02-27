<template>
    <div class="progressBar">

    <b-progress  :max="max">
      <b-progress-bar :value="counter" :label="`${counter} ${label}`"></b-progress-bar>
    </b-progress>
    </div>
</template>
<script>

import BProgress from 'bootstrap-vue/es/components/progress/progress'
import BProgressBar from 'bootstrap-vue/es/components/progress/progress-bar'
export default {
    props: {
        counter :{type: Number ,required : true  , default:0},
        label:{type:String ,  default:'%'},
        max:{type: Number ,required : true  , default:100}
        },
    data() {
      return {
      }
    },
    methods: {
    },
    components: {BProgress , BProgressBar}
  }
</script>
<style>

</style>
