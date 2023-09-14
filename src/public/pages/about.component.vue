<template>
  <div class="about">
    <h1>This is about page</h1>
  </div>
</template>

<script>
export default {
  name: "about",
  title: "About Us"
}
</script>

<style scoped>
  @media (min-width: 1024px) {
    .about {
      min-height: 100vh;
      display: flex;
      align-items: center;
    }
  }
</style>