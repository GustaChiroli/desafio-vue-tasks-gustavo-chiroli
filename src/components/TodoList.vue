<template>
  <v-container fluid class="pa-8 d-flex justify-center">
    <v-snackbar-queue v-model ="messages" :color="colorString" location="top center"></v-snackbar-queue>
    <v-card class="pa-6 custom-card"  width="800" elevation="10" rounded="xl">
      <v-card-title
        class="text-h5 font-weight-bold d-flex justify-space-between align-center custom-card-title"
      >
        <div class="d-flex align-center justify-center flex-column flex-md-row" style="width: 100%">
          <div class="text-h6 font-weight-bold color--primary">
            📝 My To-Do List
          </div>
          
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

      <v-divider class="mt-4 mb-5" />
      <div class="text-center text-body-2 text-grey">
        {{ remainingTasks }} task{{ remainingTasks !== 1 ? "s" : "" }} remaining
      </div>
      <v-row class="mt-6" dense>
        <v-col cols="12" sm="6" md="4">
          <v-card
            class="pa-6 d-flex align-center justify-center add-task-card"
            elevation="6"
            rounded="lg"
            @click="dialog = true"
          >
            <v-icon size="64" color="primary">mdi-plus-circle-outline</v-icon>
          </v-card>
        </v-col>

        <v-col
          v-for="task in filteredTasks"
          :key="task.id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="pa-4 task-card d-flex flex-column"
            :class="{ 'task-done': task.done }"
            elevation="6"
            rounded="lg"
            theme="light"
          >
            <div
              class="status-bar"
              :class="task.done ? 'status-done' : 'status-pending'"
            ></div>
            <div class="flex-grow-1">
              <v-row justify="center" align="center">
                <v-col cols="9" justify="center" align="start">
                  <div class="text-subtitle-1 font-weight-medium break-word task-title color-black">
                    {{ task.title }}
                  </div>
                  
                </v-col >
                <v-col cols="3">
                  <v-checkbox
                  v-model="task.done"
                    color="primary"
                    hide-details
                    @change="store.setTasks"
                    />
                </v-col>
                      
              </v-row>
              <v-row>
                        
                <div class="text-body-2 px-4 py-0 text-grey task-description">
                  {{ task.description }}
                </div>
              </v-row>

            </div>
            <v-row class="py-2a" style="height: 100%;" justify="end" align="end">
              <v-col cols="6" class="pa-1">
                <v-btn
                  color="secondary"
                  block
                  class="rounded-lg"
                  @click="openEditDialog(task)"
                  :disabled="task.done"
                >
                  <v-icon start>mdi-pencil</v-icon>
                  Edit
                </v-btn>
              </v-col>

              <v-col cols="6" class="pa-1">
                <v-btn
                  color="error"
                  block
                  class="rounded-lg"
                  @click="openDeleteDialog(task)"
                  :disabled="task.done"
                >
                  <v-icon start>mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      
    </v-card>
    
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useTaskStore } from "@/stores/taskStore";
import AddTaskDialog from "./AddTaskDialog.vue";
import EditTaskDialog from "./EditTaskDialog.vue";
import DeleteTaskDialog from "./DeleteTaskDialog.vue";

const store = useTaskStore();

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
.add-task-card {
  cursor: pointer;
  background: #e3f2fd; /* azul clarinho */
  border: 2px dashed #1976d2; /* borda tracejada */
  transition: all 0.2s ease;
  min-height: 250px;
}

.add-task-card:hover {
  background: #bbdefb;
  transform: translateY(-3px);
  box-shadow: 0 8px 14px rgba(25, 118, 210, 0.2);
}

.task-title {
  font-weight: 600;
  font-size: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 1; 
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.task-description {
  color: #666;
  font-size: 0.875rem;
  display: -webkit-box;
  line-clamp: 5;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
}

.task-card {
  position: relative;
  overflow: hidden;
  background-color: #fff;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  min-height: 250px;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0,0,0,0.08);
}

/* Faixa superior */
.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 6px;
  width: 100%;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Cores da faixa */
.status-pending {
  background-color: #1976d2; 
}

.status-done {
  background-color: #9e9e9e; 
}

.task-done {
  opacity: 0.8;
  background-color: #f8f8f8;
}

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
  background-color: #f3f7ff !important; 
  color: #000 !important;
}

.custom-card-title {
  color: #000 !important; 
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
