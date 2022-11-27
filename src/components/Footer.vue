<template>
  <div>
    <div>这是footer组件</div>
    <coupon />
  </div>
</template>

<script>
import { get } from '@/cdnLoader';
export default {
  components: {
    coupon: () => get('coupon'),
  }
}
</script>

<style>

</style>