<template>
  <!-- Delete Tutorials Confirmation Dialog -->
  <pv-dialog v-bind:visible="visible" :modal="true" :style="{width: '450px'}" header="Confirm">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
      <span v-if="item">Are you sure you want to delete <b>{{ item.title }}</b></span>
    </div>
    <template #footer>
      <pv-button label="No" class="p-button-text" icon="pi pi-times"
                 @click="onCancel"/>
      <pv-button label="Yes" class="p-button-text" icon="pi pi-check" @click="onConfirm"/>
    </template>
  </pv-dialog>
</template>

<script>
export default {
  name: "tutorial-item-delete-confirmation-dialog",
  props: {
    item: null,
    visible: false,
  },

  methods: {

    onCancel() {
      this.$emit('cancel');
    },

    onConfirm() {
      this.$emit('confirm', this.item);
    }
  }
}
</script>


<style scoped>
.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>