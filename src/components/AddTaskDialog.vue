<template>
  <v-dialog v-model="model" max-width="600">
    <v-card class="pa-6" rounded="xl">
      <v-card-title class="text-h6 font-weight-bold">
        ➕ Add a New Task
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="title"
          label="Task Title"
          variant="outlined"
          clearable
          class="mb-4"
        />
        <v-textarea
          v-model="description"
          label="Task Description"
          variant="outlined"
          clearable
          rows="3"
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" color="grey" @click="closeDialog"> Cancel </v-btn>
        <v-btn color="primary" rounded="lg" @click="handleAddTask">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{ modelValue: boolean }>();
const emit = defineEmits(["update:modelValue", "add-task"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const title = ref("");
const description = ref("");

const closeDialog = () => {
  title.value = "";
  description.value = "";
  emit("update:modelValue", false);

};

const handleAddTask = () => {
  if (title.value.trim()) {
    emit("add-task", title.value, description.value);
    closeDialog();
  }
};
</script>
