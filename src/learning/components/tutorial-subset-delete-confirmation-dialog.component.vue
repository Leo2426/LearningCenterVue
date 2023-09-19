<template>
  <!-- Delete Selected Tutorials Confirmation Dialog -->
  <pv-dialog v-bind:visible="visible" :modal="true" :style="{width: '450px'}" header="Confirm">
    <div class="confirmation-content">
      <i class="pi pi-exclamation-triangle p-mr-3" style="font-size: 2rem"/>
      <span v-if="subset">Are you sure you want to delete the selected tutorials?</span>
    </div>
    <template #footer>
      <pv-button label="No" class="p-button-text" icon="pi pi-times"
                 @click="onCancel"/>
      <pv-button label="Yes" class="p-button-text" icon="pi pi-check"
                 @click="onConfirm"/>
    </template>
  </pv-dialog>
</template>

<script>
export default {
  name: "tutorial-subset-delete-confirmation-dialog",
  props: {
    subset: Array,
    visible: Boolean,
  },
  methods: {
    onCancel() {
      this.$emit('cancel');
    },
    onConfirm() {
      this.$emit('confirm', this.subset);
    },
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