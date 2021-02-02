<template>
  <div class="vh-100 d-flex flex-column">
    <slot name="header" />
    <main class="flex-1">
      <slot />
    </main>
    <slot name="footer"/>
  </div>
</template>
<style lang="scss" scoped></style>
