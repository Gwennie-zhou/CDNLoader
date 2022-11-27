<template>
  <div>
    <div>这是header组件</div>
    <coupon />
    <shareButton />
  </div>
</template>

<script>
import { get } from '@/cdnLoader';
export default {
  components: {
    coupon: () => get('coupon'),
    shareButton: () => get('share-button'),
  }
}
</script>

<style>

</style>