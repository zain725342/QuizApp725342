<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

type quiz_keys = {
  key: string;
  title: string;
};

const quizzes = ref<quiz_keys[]>([]);

onMounted(() => {
  quizzes.value = JSON.parse(localStorage.getItem("quiz_keys") as string);
});
</script>

<template>
  <main class="flex flex-col">
    <div class="flex flex-col justify-center items-center gap-4 h-[12rem]">
      <h3 class="text-4xl font-semibold">Welcome</h3>
      <h4 class="text-2xl">
        {{ quizzes?.length > 0 ? "Take A Quiz" : "Create A Quiz" }}
      </h4>
    </div>
    <div class="flex flex-wrap justify-center gap-8">
      <div
        class="w-1/5 h-[15rem] flex justify-center items-center border-2 rounded-md text-gray-600 hover:text-white hover:bg-gray-600 cursor-pointer"
        v-for="quiz in quizzes"
        @click="router.push({ name: 'take', params: { key: quiz.key } })"
      >
        <h3 class="text-xl font-semibold">{{ quiz.title }}</h3>
      </div>
    </div>
    <div class="flex justify-center items-center my-10">
      <Button @click="router.push('create')">Create</Button>
    </div>
  </main>
</template>
