<template>
  <div class="">
    <div>1,{{ dj }}</div>
    <div>{{ kka }}</div>
    <hello />
  </div>
</template>
<script>
import Hello from "./Hello1.vue";
export default {
  data() {
    return {
      dj: "1222s",
      kka: "duodueoaasadadasds",
    };
  },
  components: {
    Hello,
  },
}
</script>
<style>
body {
  background: red;
}
</style>