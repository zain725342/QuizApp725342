<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/toast/use-toast";
import type { quiz } from "@/types";

const router = useRouter();
const route = useRoute();
const { toast } = useToast();

const quiz_data = ref<quiz>();
const quiz_attempted = ref(false);
const correct_answers = ref<string[]>([]);
const score = ref(0);
const duration_in_minutes = ref(0);
let intervalId = 0;
const storage_key = ref("");

const review_mode = ref(false);

const checkAnswers = () => {
  quiz_data.value?.questions.forEach((question, index) => {
    if (question.correct == correct_answers.value[index]) {
      score.value++;
    }
  });
  clearInterval(intervalId);
  (quiz_data.value as quiz).number_of_attempts--;
  quiz_attempted.value = true;
};

const startCountdown = () => {
  intervalId = setInterval(() => {
    if ((quiz_data.value as quiz).duration > 0) {
      (quiz_data.value as quiz).duration -= 1;
    } else {
      checkAnswers();
    }
  }, 1000);
};

const retake = () => {
  quiz_attempted.value = false;
  correct_answers.value = [];
  score.value = 0;
  (quiz_data.value as quiz).duration = duration_in_minutes.value * 60;
  startCountdown();
};

const getReviewClass = (index: number, option: string) => {
  if (quiz_data.value?.questions[index].correct == option) {
    return "text-green-500";
  } else if (correct_answers.value[index] == option) {
    return "text-red-500";
  }
};
onMounted(() => {
  storage_key.value = "quiz_" + route.params.key;
  quiz_data.value = JSON.parse(
    localStorage.getItem(storage_key.value) as string
  );
  if (quiz_data.value?.number_of_attempts == 0) {
    toast({
      title: "Warning",
      description: "Quiz expired!",
    });
    router.push({ name: "home" });
  } else {
    duration_in_minutes.value = (quiz_data.value as quiz).duration;
    (quiz_data.value as quiz).duration = duration_in_minutes.value * 60;
    startCountdown();
  }
});

onUnmounted(() => {
  (quiz_data.value as quiz).duration = duration_in_minutes.value;
  localStorage.setItem(storage_key.value, JSON.stringify(quiz_data.value));
});
</script>
<template>
  <div class="h-[35rem] w-full flex flex-col gap-4 justify-center items-center">
    <div
      v-if="quiz_attempted == false || review_mode"
      class="flex justify-start flex-col h-[80%] w-[40%] border-2 rounded-md py-10"
    >
      <div class="text-2xl font-semibold flex justify-center">
        {{ review_mode == false ? quiz_data?.title : "Quiz review" }}
      </div>
      <ScrollArea
        class="w-[100%] p-4 mt-4"
        :class="review_mode == false ? 'h-[80%]' : 'h-[100%]'"
      >
        <div v-for="(question, index) in quiz_data?.questions">
          <div class="flex flex-col gap-y-4">
            <h3 class="font-semibold">Question {{ index + 1 }}</h3>
            <p>{{ question.question }}</p>
            <div>
              <RadioGroup
                default-value="option-one"
                v-model="correct_answers[index]"
              >
                <div class="flex items-center space-x-2">
                  <RadioGroupItem
                    :disabled="review_mode == true"
                    id="option-one"
                    value="A"
                  />
                  <Label for="option-one"
                    >{{ "A) "
                    }}<span
                      :class="
                        review_mode == true ? getReviewClass(index, 'A') : ''
                      "
                      >{{ question.A }}</span
                    ></Label
                  >
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem
                    :disabled="review_mode == true"
                    id="option-two"
                    value="B"
                  />
                  <Label for="option-two"
                    >{{ "B) "
                    }}<span
                      :class="
                        review_mode == true ? getReviewClass(index, 'B') : ''
                      "
                      >{{ question.B }}</span
                    ></Label
                  >
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem
                    :disabled="review_mode == true"
                    id="option-one"
                    value="C"
                  />
                  <Label for="option-one"
                    >{{ "C) "
                    }}<span
                      :class="
                        review_mode == true ? getReviewClass(index, 'C') : ''
                      "
                      >{{ question.C }}</span
                    ></Label
                  >
                </div>
                <div class="flex items-center space-x-2">
                  <RadioGroupItem
                    :disabled="review_mode == true"
                    id="option-two"
                    value="D"
                  />
                  <Label for="option-two"
                    >{{ "D) "
                    }}<span
                      :class="
                        review_mode == true ? getReviewClass(index, 'D') : ''
                      "
                      >{{ question.D }}</span
                    ></Label
                  >
                </div>
              </RadioGroup>
            </div>
          </div>
          <hr class="my-4" />
        </div>
      </ScrollArea>
      <div
        v-if="review_mode == false"
        class="flex justify-between mt-8 text-sm px-6"
      >
        <div>Allowed attempts: {{ quiz_data?.number_of_attempts }}</div>
        <div>Time remaining: {{ Number(quiz_data?.duration) }}s</div>
      </div>
      <div v-else class="flex justify-between mt-8 text-sm px-6">
        <div>Score: {{ score }}</div>
      </div>
    </div>
    <div
      class="flex justify-center items-center flex-col gap-4 h-[80%] w-[40%] border-2 rounded-md py-10"
      v-else
    >
      <h3 class="text-lg font-semibold">Score: {{ score }}</h3>
      <p>Attempts remaining: {{ (quiz_data as quiz)?.number_of_attempts }}</p>
    </div>
    <div class="w-[40%] flex justify-end gap-4">
      <Button
        v-if="quiz_attempted==true&& (quiz_data as quiz)?.number_of_attempts > 0"
        @click="retake()"
        >Retake</Button
      >
      <Button
        v-else-if="quiz_attempted==true&& (quiz_data as quiz)?.number_of_attempts ==0 && review_mode==false"
        @click="review_mode = true"
        >Review</Button
      >
      <Button
        @click="
          quiz_attempted == false
            ? checkAnswers()
            : router.push({ name: 'home' })
        "
        >{{ quiz_attempted == false ? "Submit" : "Back" }}</Button
      >
    </div>
  </div>
</template>
