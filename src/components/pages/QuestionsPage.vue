<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/toast/use-toast";
import { ref, watch } from "vue";

import type { questionsPageType } from "@/types";

const { toast } = useToast();

const props = defineProps(["title", "count"]);

const data = defineModel<questionsPageType[]>();

const emit = defineEmits(["failed", "success"]);

const question = ref("");
const A = ref("");
const B = ref("");
const C = ref("");
const D = ref("");
const correct = ref("");

watch(
  () => props.count,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      if (
        question.value == "" ||
        A.value == "" ||
        B.value == "" ||
        C.value == "" ||
        D.value == ""
      ) {
        toast({
          title: "Warning",
          description: "Enter valid data in all fields",
        });
        emit("failed");
      } else if (correct.value == "") {
        toast({
          title: "Warning",
          description: "Select the correct option",
        });
        emit("failed");
      } else {
        (data.value as questionsPageType[]).push({
          question: question.value,
          A: A.value,
          B: B.value,
          C: C.value,
          D: D.value,
          correct: correct.value,
        });
        question.value = "";
        (A.value = ""), (B.value = ""), (C.value = ""), (D.value = "");
        correct.value = "";
        emit("success");
      }
    }
  }
);
</script>
<template>
  <div>
    <div class="text-2xl font-semibold flex justify-center">{{ title }}</div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mt-12">
      <Label for="title">Question {{ count }}</Label>
      <Input
        id="question"
        placeholder="Write a question"
        type="text"
        v-model="question"
      />
    </div>
    <div class="grid w-full max-w-sm items-center gap-1.5 mt-6">
      <Label for="options">Options</Label>
      <RadioGroup default-value="option-one" v-model="correct">
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="option-one" value="A" />
          <Label for="option-one"
            ><Input type="text" placeholder="A" v-model="A"
          /></Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="option-two" value="B" />
          <Label for="option-two"
            ><Input type="text" placeholder="B" v-model="B"
          /></Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="option-one" value="C" />
          <Label for="option-one"
            ><Input type="text" placeholder="C" v-model="C"
          /></Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="option-two" value="D" />
          <Label for="option-two"
            ><Input type="text" placeholder="D" v-model="D"
          /></Label>
        </div>
      </RadioGroup>
    </div>
  </div>
</template>
