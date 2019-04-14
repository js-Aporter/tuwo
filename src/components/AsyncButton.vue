<template>
  <Button :loading="pending" :type="type" @click="handleClick">
    <slot></slot>
  </Button>
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'primary'
      }
    },

    data() {
      return {
        pending: false
      }
    },

    methods: {
      handleClick(evt) {
        if (!this.pending) {
          this.pending = true;
          this.$emit('click', evt, () => {
            this.pending = false;
          });
        }
      }
    }
  }
</script>
