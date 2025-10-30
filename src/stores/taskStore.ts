import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { useLoadingStore } from "./loadingStore";

export interface Task {
    id: number;
    title: string;
    description: string;
    done: boolean;
}

export const useTaskStore = defineStore("taskStore", () => {
    const loading = useLoadingStore();
    const tasks = ref<Task[]>([]);

    const loadTasks = async () => {
        loading.show();
        try {
            const stored = localStorage.getItem("tasks");
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (stored) tasks.value = JSON.parse(stored);
        } finally {
            loading.hide();
        }
    };

    const setTasks = async () => {
        loading.show();
        try {
            localStorage.setItem("tasks", JSON.stringify(tasks.value));
            await new Promise(resolve => setTimeout(resolve, 400));
        } finally {
            loading.hide();
        }
    };

    watch(tasks, (newVal) => {
        localStorage.setItem("tasks", JSON.stringify(newVal));
    }, { deep: true });

    const remainingTasks = computed(() => tasks.value.filter(task => !task.done).length);

    const addTask = async (title: string, description: string) => {
        loading.show();
        try {
            const lastId = tasks.value.length ? Number(tasks.value[tasks.value.length - 1]?.id) || 0 : 0;
            tasks.value.push({ id: lastId + 1, title: title, description: description, done: false });

            await new Promise(resolve => setTimeout(resolve, 400));
        } finally {
            loading.hide();
        }
    };

    const updateTask = async (updatedTask: Task) => {
        loading.show();
        try {
            const index = tasks.value.findIndex((t) => t.id === updatedTask.id);
            if (index !== -1) {
                tasks.value[index] = updatedTask;
            }
            await new Promise(resolve => setTimeout(resolve, 400));
        } finally {
            loading.hide();
        }
    };

    const removeTask = async (id: number) => {
        loading.show();
        try {
            tasks.value = tasks.value.filter((t) => t.id !== id);
            await new Promise(resolve => setTimeout(resolve, 400));
        } finally {
            loading.hide();
        }


    };

    return {
        tasks,
        remainingTasks,
        loadTasks,
        setTasks,
        addTask,
        updateTask,
        removeTask,
    };
});