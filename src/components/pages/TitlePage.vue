<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, onMounted, watch } from "vue";

import type { titlePageType } from "@/types";

const title = ref("");
const questions = ref(1);

const titlePageData = defineModel<titlePageType>();
let timer: ReturnType<typeof setTimeout> | null = null;
const delay = 500;

watch(title, (newValue, oldValue) => {
  clearTimeout(timer as number);

  timer = setTimeout(() => {
    (titlePageData.value as titlePageType).title = title.value;
  }, delay);
});
watch(questions, (newValue, oldValue) => {
  clearTimeout(timer as number);

  timer = setTimeout(() => {
    (titlePageData.value as titlePageType).questions = questions.value;
  }, delay);
});

onMounted(() => {});
</script>
<template>
  <div>
    <div class="text-2xl font-semibold flex justify-center">Create Quiz</div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mt-16">
      <Label for="title">Title</Label>
      <Input
        id="title"
        placeholder="Give it a title"
        type="text"
        v-model="title"
      />
    </div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mt-16">
      <Label for="questions">Number of questions</Label>
      <Input id="questions" type="number" v-model="questions" />
    </div>
  </div>
</template>
