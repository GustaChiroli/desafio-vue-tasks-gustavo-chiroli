<template>
  <v-container fluid class="pa-8 d-flex justify-center">
    <v-snackbar-queue v-model ="messages" :color="colorString" location="top center"></v-snackbar-queue>
    <v-card class="pa-6 custom-card"  width="800" elevation="10" rounded="xl">
      <v-card-title
        class="text-h5 font-weight-bold d-flex justify-space-between align-center custom-card-title"
      >
        <div class="d-flex align-center justify-space-between flex-column flex-md-row" style="width: 100%">
          <div class="text-h6 font-weight-bold color--primary">
            📝 My To-Do List
          </div>
          <v-btn color="primary" rounded="lg" class="mt-md-0 mt-4" @click="dialog = true">
            <v-icon start>mdi-plus</v-icon>
            Add Task
          </v-btn>
        </div>
      </v-card-title>
      <v-row class="mt-4" justify="center">
        <v-btn-toggle v-model="filter" rounded="lg" mandatory>
          <v-btn
            value="all"
            prepend-icon="mdi-format-list-bulleted"
            class="btn-responsive"
          >
            All
          </v-btn>
          <v-btn
            value="pending"
            prepend-icon="mdi-clock-outline"
            class="btn-responsive"
          >
            Pending
          </v-btn>
          <v-btn
            value="done"
            prepend-icon="mdi-check-circle-outline"
            class="btn-responsive"
          >
            Completed
          </v-btn>
        </v-btn-toggle>
      </v-row>
      <AddTaskDialog v-model="dialog" @add-task="addTask" />
      <EditTaskDialog
        v-model="editDialog"
        :task="currentTask"
        @update-task="updateTask"
      />
      <DeleteTaskDialog
        v-model="deleteDialog"
        :task="currentTask"
        @delete-task="removeTask" />

      <v-data-table
        :headers="headers"
        headers-align="center"
        :items="filteredTasks"
        item-key="id"
        class="elevation-1 mt-6"
        dense
        disable-sort
      >
        <template #header.id>
          <div class="d-none d-sm-flex">ID</div>
        </template>

        <template #item.done="{ item }">
          <div class="d-flex justify-center">
            <v-checkbox
              v-model="item.done"
              color="primary"
              hide-details
              @change="store.setTasks"
            />

          </div>
        </template>
        <template #item.id="{ item }">
          <div class="d-none d-sm-flex break-word">{{ item.id }}</div>
        </template>
        <template #item.title="{ item }">
          <div class="break-word">{{ item.title }}</div>
        </template>

        <template #item.description="{ item }">
          <div class="break-word">{{ item.description }}</div>
        </template>

        <template #item.actions="{ item }">
          <v-btn icon color="secondary"class="rounded-lg mr-sm-1" size="small" @click="openEditDialog(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon color="error"class="rounded-lg" size="small" @click="openDeleteDialog(item)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>

        <template #no-data>
          <v-alert type="info">No tasks added yet</v-alert>
        </template>
      </v-data-table>

      <v-divider class="my-4" />
      <div class="text-center text-body-2 text-grey">
        {{ remainingTasks }} task{{ remainingTasks !== 1 ? "s" : "" }} remaining
      </div>
    </v-card>
    
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useTaskStore } from "@/stores/taskStore";
import { useLoadingStore } from "@/stores/loadingStore";
import AddTaskDialog from "./AddTaskDialog.vue";
import EditTaskDialog from "./EditTaskDialog.vue";
import DeleteTaskDialog from "./DeleteTaskDialog.vue";

const store = useTaskStore();
const loadingStore = useLoadingStore();

interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

onMounted(() => {
  store.loadTasks();
});

const remainingTasks = computed(
  () => store.tasks.filter((t) => !t.done).length
);

const dialog = ref(false);
const editDialog = ref(false);
const deleteDialog = ref(false);
const currentTask = ref<Task>({ id: 0, title: "", description: "", done: false });
const text = ref('');
const messages = ref<string[]>([]);
const colorString = ref('success');
const filter = ref<'all' | 'pending' | 'done'>('all');

const filteredTasks = computed(() => {
  if (filter.value === 'pending') {
    return store.tasks.filter((t) => !t.done);
  }
  if (filter.value === 'done') {
    return store.tasks.filter((t) => t.done);
  }
  return store.tasks; 
});

const openEditDialog = (task: Task) => {
  currentTask.value = { ...task };
  editDialog.value = true;
};

const openDeleteDialog = (task: Task) => {
  currentTask.value = { ...task };
  deleteDialog.value = true;
};  

const updateTask = (updatedTask: Task) => {
  store.updateTask(updatedTask);
  setSnackbar('Task updated successfully', 'success');
};

const addTask = async ( title: string, description: string ) => {
  store.addTask(title, description);
  await nextTick();
  setSnackbar('Task added successfully', 'success');
};

const removeTask = (id: number) => {
  store.removeTask(id);
  setSnackbar('Task deleted successfully', 'success');
};

const setSnackbar = (msg: string, color: string) => {
  colorString.value = color;
  messages.value.push(msg);
};

const headers = [
  { title: "Done", align: 'center' as const , key: "done" },
  { title: "ID", key: "id" },
  { title: "Title", key: "title" },
  { title: "Description", key: "description" },
  { title: "Actions", align: 'center' as const, key: "actions"},
];

</script>

<style scoped>
.v-card {
  background: linear-gradient(145deg, #ffffff, #f3f7ff);
}
.text-grey {
  color: #9e9e9e !important;
}

.v-btn-toggle {
  background-color: #f5f7fb;
  padding: 4px;
}
.v-btn-toggle .v-btn {
  text-transform: none;
  font-weight: 500;
}
.break-word {
  white-space: normal !important;
  word-break: break-word;        
  overflow-wrap: break-word;    
  min-width: 50px;   
}

.custom-card {
  background-color: #f3f7ff !important; /* força cor de fundo */
  color: #000 !important; /* força cor do texto */
}

.custom-card-title {
  color: #000 !important; /* força cor do título */
}
.btn-responsive {
  font-size: 1rem; 
}

@media (max-width: 600px) {
  .btn-responsive {
    font-size: 0.75rem; 
    padding: 2px 6px; 
  }

  .btn-responsive .v-icon {
    font-size: 16px !important;
  }
}

</style>
