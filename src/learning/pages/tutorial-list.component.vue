<template>

</template>

<script>
import {TutorialsApiService} from "../services/tutorials-api.service.js";

export default {
  name: "tutorial-list",
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
        { label: "Published", value: "published" },
        { label: "Unpublished", value: "unpublished" },
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
          console.log(response.data);
        })
  },
}
</script>

<style scoped>

</style>