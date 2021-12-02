<template>
  <div>{{ wallet.address }} {{ wallet.balance.eth }}</div>
</template>

<script>
export default {
  naem: "wallet",
  props: ["wallet"],
};
</script>

<style></style>
