<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { ref } from "vue";
import { useRouter } from "vue-router";
import type {
  titlePageType,
  questionsPageType,
  durationPageType,
} from "@/types";
import TitlePage from "@/components/pages/TitlePage.vue";
import QuestionsPage from "@/components/pages/QuestionsPage.vue";
import DurationPage from "@/components/pages/DurationPage.vue";

const router = useRouter();
const { toast } = useToast();

const question_count = ref(1);

const titlePageData = ref<titlePageType>({
  title: "",
  questions: 1,
});

const durationPageData = ref<durationPageType>({
  duration: 1,
  attempts: 1,
});

const questionsPageData = ref<questionsPageType[]>([]);
const step = ref("one");

const reduceCount = () => {
  question_count.value--;
};
const checkQuestions = () => {
  if (question_count.value > titlePageData.value.questions) {
    step.value = "three";
  }
};
const moveToNext = () => {
  if (step.value == "one") {
    if (titlePageData.value.title == "" || titlePageData.value.questions < 1) {
      toast({
        title: "Warning",
        description: "Enter valid data in all fields",
      });
    } else {
      step.value = "two";
    }
  } else if (step.value == "two") {
    question_count.value++;
  }
};
const createQuiz = () => {
  let payload = {
    title: titlePageData.value.title,
    number_of_questions: titlePageData.value.questions,
    questions: questionsPageData.value,
    duration: durationPageData.value.duration,
    number_of_attempts: durationPageData.value.attempts,
  };
  let storage_key = payload.title.toLowerCase();
  storage_key = storage_key.trimEnd().replaceAll(" ", "_");
  localStorage.setItem("quiz_" + storage_key, JSON.stringify(payload));
  let keysArray = JSON.parse(localStorage.getItem("quiz_keys") as string);
  if (keysArray == null) {
    keysArray = [];
  }
  let keyData = {
    key: storage_key,
    title: payload.title,
  };
  keysArray.push(keyData);
  localStorage.setItem("quiz_keys", JSON.stringify(keysArray));
  router.push({ name: "home" });
};
</script>
<template>
  <div class="h-[35rem] w-full flex flex-col gap-4 justify-center items-center">
    <div
      class="flex justify-start flex-col h-[80%] w-[40%] border-2 rounded-md p-10"
    >
      <TitlePage v-if="step == 'one'" v-model="titlePageData" />
      <QuestionsPage
        v-else-if="step == 'two'"
        :title="titlePageData.title"
        :count="question_count"
        v-model="questionsPageData"
        @failed="reduceCount()"
        @success="checkQuestions()"
      />
      <DurationPage v-else v-model="durationPageData" />
    </div>
    <div class="w-[40%] flex justify-end gap-4">
      <Button @click="router.push({ name: 'home' })">Discard</Button>
      <Button @click="step == 'three' ? createQuiz() : moveToNext()">{{
        step == "three" ? "Create" : "Next"
      }}</Button>
    </div>
  </div>
</template>
