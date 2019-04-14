<template>
  <Modal :value="value" :loading="loading">
    <Button>按钮</Button>
  </Modal>
</template>

<script>
  import ActiveModal from '@/libs/active-modal'

  export default {
    name: "test-modal",
    mixins: [ActiveModal],
    methods: {
      handleOk() {
        // alert('ok')
        console.log('ok', this)
      },
      handleSubmit(resolve, reject) {
        // alert('ok')
        setTimeout(resolve, 1000)
      }
    }
  }
</script>

<style scoped>

</style>
