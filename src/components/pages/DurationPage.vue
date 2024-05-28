<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ref, onMounted, watch } from "vue";

import type { durationPageType } from "@/types";

const duration = ref(1);
const attempts = ref(1);

const durationPageData = defineModel<durationPageType>();
let timer: ReturnType<typeof setTimeout> | null = null;
const delay = 500;

watch(duration, (newValue, oldValue) => {
  clearTimeout(timer as number);

  timer = setTimeout(() => {
    (durationPageData.value as durationPageType).duration = duration.value;
  }, delay);
});
watch(attempts, (newValue, oldValue) => {
  clearTimeout(timer as number);

  timer = setTimeout(() => {
    (durationPageData.value as durationPageType).attempts = attempts.value;
  }, delay);
});

onMounted(() => {});
</script>
<template>
  <div>
    <div class="text-2xl font-semibold flex justify-center">Almost done...</div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mt-16">
      <Label for="duration">Duration</Label>
      <Input
        id="duration"
        placeholder="Duration in minutes"
        type="number"
        v-model="duration"
      />
    </div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mt-16">
      <Label for="attempts">Possible attempts</Label>
      <Input
        id="attempts"
        type="number"
        v-model="attempts"
        placeholder="Number of attempts"
      />
    </div>
  </div>
</template>
