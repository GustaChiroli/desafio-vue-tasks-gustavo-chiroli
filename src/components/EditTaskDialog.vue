<template>
  <v-dialog v-model="model" max-width="600">
    <v-card class="pa-6" rounded="xl">
      <v-card-title class="text-h6 font-weight-bold">
       ✏️ Edit Task
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="editedTitle"
          label="Task Title"
          variant="outlined"
          clearable
          class="mb-4"
        />
        <v-textarea
          v-model="editedDescription"
          label="Task Description"
          variant="outlined"
          clearable
          rows="3"
        />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" color="grey" @click="closeDialog"> Cancel </v-btn>
        <v-btn color="primary" rounded="lg" @click="saveTasks">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  modelValue: boolean;
  task: { id: number; title: string; description: string };
}>();

const emit = defineEmits(["update:modelValue", "update-task"]);

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const editedTitle = ref(props.task.title);
const editedDescription = ref(props.task.description);

watch(
  () => props.task,
  (newTask) => {
    editedTitle.value = newTask.title;
    editedDescription.value = newTask.description;
  },
    { immediate: true }
);

const closeDialog = () => {
  emit("update:modelValue", false);
};

const saveTasks = () => {
  if (editedTitle.value.trim()) {
    emit("update-task", {
      id: props.task.id,
      title: editedTitle.value.trim(),
      description: editedDescription.value.trim(),
    });
    closeDialog();
  }
};
</script>