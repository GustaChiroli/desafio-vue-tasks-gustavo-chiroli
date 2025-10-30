<template>
    <v-dialog v-model="modelValue" max-width="500">
      <v-card class="pa-6" rounded="xl">
        <v-card-title class="text-h6 font-weight-bold">
          🗑️ Delete Task
        </v-card-title>

        <v-card-text>
          Are you sure you want to delete the task "<strong>{{ task.title }}</strong>"?
        </v-card-text>

        <v-card-actions class="justify-end">
          <v-btn variant="text" color="grey" @click="closeDialog"> Cancel </v-btn>
          <v-btn color="error" rounded="lg" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
    const emit = defineEmits(["update:modelValue", "delete-task"]);
    const props = defineProps<{
      modelValue: boolean;
      task: { id: number; title: string; description: string };
    }>();

    const modelValue = computed({
        get: () => props.modelValue,
        set: (value) => emit("update:modelValue", value),
    });

    const closeDialog = () => {
        emit("update:modelValue", false);
    }

    const confirmDelete = () => {
        emit("delete-task", props.task.id);
        emit("update:modelValue", false);
    };
</script>