<template>
  <div class="tutorials">
    <div class="card">
      <!-- Tutorials Toolbar Section -->
      <pv-toolbar class="mb-4">
        <template #start>
          <pv-button class="mr-2" icon="pi pi-plus" label="New" severity="success" @click="openNew"/>
          <pv-button :disabled="!selectedTutorials || !selectedTutorials.length" icon="pi pi-trash" label="Delete"
                     severity="danger" @click="confirmDeleteSelected"/>
        </template>
        <template #end>
          <pv-button icon="pi pi-download" label="Export" severity="help" @click="exportToCsv($event)"/>
        </template>
      </pv-toolbar>

      <!-- Data Table Section -->
      <pv-data-table ref="dt" v-model:selection="selectedTutorials"
                     :filters="filters"
                     :paginator="true"
                     :rows="10"
                     :rowsPerPageOptions="[5, 10, 25]"
                     :value="tutorials"
                     currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tutorials"
                     dataKey="id"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                     responsiveLayout="scroll">
        <template #header>
          <div class="table-header gap-2 align-items-center justify-content-between">
            <h4 class="m-0">Manage Tutorials</h4>
            <span class="p-input-icon-left">
              <i class="pi- pi-search"/>
              <pv-input-text v-model="filters['global'].value" placeholder="Search..."/>
            </span>
          </div>
        </template>
        <pv-column :exportable="false" selectionMode="multiple" style="width: 3rem"/>
        <pv-column :sortable="true" field="id" header="Id" style="min-width: 12rem"/>
        <pv-column :sortable="true" field="title" header="Title" style="min-width: 16rem"/>
        <pv-column :sortable="true" field="description" header="Description" style="min-width: 16rem"/>
        <pv-column :sortable="true" field="status" header="Status" style="min-width: 12rem">
          <template #body="slotProps">
            <pv-tag :severity="getStatusLabel(slotProps.data.status)" :value="slotProps.data.status"/>
          </template>
        </pv-column>
        <pv-column :exportable="false" style="min-width: 8rem">
          <template #body="slotProps">
            <pv-button class="mr-2" icon="pi pi-pencil" outlined rounded @click="editTutorial(slotProps.data)"/>
            <pv-button icon="pi pi-trash" outlined rounded severity="danger"
                       @click="confirmDeleteTutorial(slotProps.data)"/>
          </template>
        </pv-column>
      </pv-data-table>


      <!-- Add/Edit Tutorial Dialog -->

      <tutorial-item-add-or-edit-dialog :statuses="statuses" :tutorial="tutorial"
          v-bind:visible="tutorialDialog"
          v-on:cancel="onAddOrUpdateItemCancel" v-on:save="onSaveItem"/>


      <!-- Delete Tutorials Confirmation Dialog -->
      <tutorial-item-delete-confirmation-dialog
          :item="tutorial" v-bind:visible="deleteTutorialDialog"
          v-on:cancel="onDeleteItemCancel" v-on:confirm="onDeleteItemConfirm"/>


      <!-- Delete Selected Tutorials Confirmation Dialog -->
      <tutorial-subset-delete-confirmation-dialog
          :items="selectedTutorials" v-bind:visible="deleteTutorialsDialog"
          v-on:cancel="onDeleteSubsetCancel" v-on:confirm="onDeleteSubsetConfirm"/>

    </div>
  </div>
</template>

<script>
import {TutorialsApiService} from "../services/tutorials-api.service.js";
import {FilterMatchMode} from "primevue/api";
import TutorialItemAddOrEditDialog from "../components/tutorial-item-add-or-edit-dialog.component.vue";
import TutorialItemDeleteConfirmationDialog from "../components/tutorial-item-delete-confirmation-dialog.component.vue";
import TutorialSubsetDeleteConfirmationDialog from "../components/tutorial-subset-delete-confirmation-dialog.component.vue";
import {Tutorial} from "../model/tutorial.entity.js";

export default {
  name: "tutorial-list",
  components: {
    TutorialItemDeleteConfirmationDialog, TutorialItemAddOrEditDialog, TutorialSubsetDeleteConfirmationDialog },
  title: "Tutorials",
  data() {
    return {
      tutorials: [],
      tutorialDialog: false,
      deleteTutorialDialog: false,
      deleteTutorialsDialog: false,
      tutorial: {},
      selectedTutorials: [],
      filters: {},
      submitted: false,
      statuses: [
        {label: "Published", value: "published"},
        {label: "Unpublished", value: "unpublished"},
      ],
      tutorialsService: null,
    }
  },
  created() {
    console.log('created');
    this.tutorialsService = new TutorialsApiService();
    this.tutorialsService.getAll()
        .then(response => {
          this.tutorials = response.data;
          this.tutorials = this.tutorials.map((tutorial) => { return Tutorial.toDisplayableTutorial(tutorial) });
          console.log(response.data);
        });
    console.log(this.tutorials);
    this.initFilters();
  },
  methods: {
    initFilters() {
      this.filters = {global: {value: null, matchMode: FilterMatchMode.CONTAINS}};
    },
    getStatusLabel(status) {
      switch (status) {
        case 'Published':
          return 'success';
        case 'Unpublished':
          return 'info';
        default:
          return null;
      }
    },

    notifySuccessfulAction(message) {
      this.$toast.add({severity: 'success', summary: 'Success', detail: message, life: 3000});
    },

    getDisplayableTutorial(tutorial) {
      tutorial.status = tutorial.published ? this.statuses[0].label : this.statuses[1].label;
      return tutorial;
    },
    getStorableTutorial(displayableTutorial) {
      return {
        id: displayableTutorial.id,
        title: displayableTutorial.title,
        description: displayableTutorial.description,
        published: displayableTutorial.status.label === "Published"
      }
    },
    openNew() {
      this.tutorial = {};
      this.submitted = false;
      this.tutorialDialog = true;
    },

    onAddOrUpdateItemCancel() {
      this.tutorialDialog = false;
      this.submitted = false;
    },


    onDeleteSubsetCancel() {
      this.deleteTutorialsDialog = false;
    },

    onDeleteSubsetConfirm() {
      this.deleteSelectedTutorials();
    },

    findIndexById(id) {
      console.log(`current id is ${id}`);
      return this.tutorials.findIndex((tutorial) => tutorial.id === id);
    },

    onSaveItem() {
      this.submitted = true;
      if (this.tutorial.title.trim()) {
        if (this.tutorial.id) {
          console.log(this.tutorial);
          this.tutorial = Tutorial.fromDisplayableTutorial(this.tutorial);
          this.tutorialsService.update(this.tutorial.id, this.tutorial)
              .then((response) => {
                console.log(response.data.id);
                this.tutorials[this.findIndexById(response.data.id)] = this.getDisplayableTutorial(response.data);
                this.notifySuccessfulAction('Tutorial Updated');
                console.log(response);
              });
        } else {
          this.tutorial.id = 0;
          console.log(this.tutorial);
          this.tutorial = this.getStorableTutorial(this.tutorial);
          this.tutorialsService.create(this.tutorial)
              .then((response) => {
                console.log(response.data.id);
                this.tutorial = Tutorial.toDisplayableTutorial(response.data);
                this.tutorials.push(this.tutorial);
                this.notifySuccessfulAction('Tutorial Created');
                console.log(response);
              });
        }
        this.tutorialDialog = false;
        this.tutorial = {};
      }
    },
    editTutorial(tutorial) {
      console.log(tutorial);
      this.tutorial = {...tutorial};
      console.log(this.tutorial);
      this.tutorialDialog = true;
    },
    confirmDeleteTutorial(tutorial) {
      this.tutorial = tutorial;
      this.deleteTutorialDialog = true;
    },
    onDeleteItemCancel() {
      this.deleteTutorialDialog = false;
    },

    onDeleteItemConfirm() {
      this.deleteTutorial();
    },


    deleteTutorial() {
      this.tutorialsService.delete(this.tutorial.id)
          .then((response) => {
            this.tutorials = this.tutorials.filter((t) => t.id !== this.tutorial.id);
            this.deleteTutorialDialog = false;
            this.tutorial = {};
            this.$toast.add({severity: 'success', summary: 'Success', detail: 'Tutorial Deleted', life: 3000});
            console.log(response);
          });
    },
    exportToCsv() {
      this.$refs.dt.exportToCsv();
    },
    confirmDeleteSelected() {
      this.deleteTutorialsDialog = true;
    },

    deleteSelectedTutorials() {
      this.selectedTutorials.forEach((tutorial) => {
        this.tutorialsService.delete(tutorial.id).then((response) => {
          this.tutorials = this.tutorials.filter((t) => t.id !== tutorial.id);
          console.log(response);
        });
      });
      this.deleteTutorialsDialog = false;
    }

  }

}
</script>

<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}


@media screen and (max-width: 960px) {
  :deep(.p-toolbar) {
    flex-wrap: wrap;
  }
}

@media (min-width: 1024px) {
  .tutorials {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>