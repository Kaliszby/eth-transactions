<template>
  <div>{{ balance }} {{ publicAddress }}</div>
</template>

<script>
export default {
  name: "profile",
  props: ["balance", "publicAddress"],
};
</script>

<style></style>
