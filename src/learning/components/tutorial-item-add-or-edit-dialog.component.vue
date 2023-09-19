<template>
  <!-- Add/Edit Tutorial Dialog -->
  <pv-dialog v-bind:visible="visible" :modal="true" :style="{width: '450px'}" class="p-fluid"
             header="Tutorial Information">
    <div class="field mt-3">
          <span class="p-float-label">
            <pv-input-text v-model.trim="tutorial.title" :class="{ 'p-invalid': submitted && !tutorial.title }"
                           autofocus required="true" type="text"/>
            <label for="title">Title</label>
            <small v-if="submitted && !tutorial.title" class="p-error">Title is required</small>
          </span>
    </div>
    <div class="field">
          <span class="p-float-label">
            <pv-input-text v-model.trim="tutorial.description" cols="20" required="false" rows="2" type="text"/>
            <label for="description">Description</label>
          </span>
    </div>
    <div class="field">
      <pv-dropdown id="published" v-model="tutorial.status" :options="statuses" optionLabel="label"
                   placeholder="Select and Status">
        <template #value="slotProps">
          <div v-if="slotProps.value && slotProps.value.value">
            <pv-tag :severity="getSeverity(slotProps.value.label)" :value="slotProps.value.value"/>
          </div>
          <div v-else-if="slotProps.value && !slotProps.value.value">
            <pv-tag :severity="getSeverity(slotProps.value)" :value="slotProps.value"/>
          </div>
          <span v-else>{{ slotProps.placeholder }}</span>
        </template>
      </pv-dropdown>
    </div>
    <template #footer>
      <pv-button label="Cancel" class="p-button-text" icon="pi pi-times" @click="onCancel"/>
      <pv-button label="Save" class="p-button-text" icon="pi pi-check" @click="onSave"/>
    </template>
  </pv-dialog>
</template>
<script>

export default {
  name: "tutorial-item-add-or-edit-dialog",
  props: {
    tutorial: null,
    visible: Boolean,
    statuses: Array,
  },
  data() {
    return {
      submitted: false,
    }
  },
  methods: {
    getSeverity(status) {
      switch (status) {
        case 'Published': return 'success';
        case 'Unpublished': return 'info';
        default: return null;
      }
    },

    onCancel() {
      this.$emit('cancel');
    },

    onSave() {
      this.submitted = true;
      if (this.tutorial.title) {
        this.$emit('save', this.tutorial);
      }
    }

  }

}
</script>



<style scoped>

</style>