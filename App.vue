<template>
  <div class="">
    <div class="bba">{{ dj }}</div>
    <div class="test">{{ kka }}</div>
    <div class="bbaaa">asd</div>
    <div class="tes">ddd</div>
    <hello />
  </div>
</template>
<script>
import Hello from "./Hello1.vue";
export default {
  data() {
    return {
      dj: "1222s",
      kka: "1",
    };
  },
  components: {
    Hello,
  },
}
</script>
<style scoped>
.test {
  background: red;
}
</style>

<style scoped>
  .bba{
    background: green;
  }
  .bbaaa{
    background: aqua;
  }
</style>