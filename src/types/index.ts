export type titlePageType = {
    title: string;
    questions: number;
};
export type questionsPageType = {
    question:string,
    A:string,
    B:string,
    C:string,
    D:string,
    correct:string,
};

export type durationPageType={
    duration:number,
    attempts:number
};

export type quiz={
    title: string,
    number_of_questions: number,
    questions: questionsPageType[],
    duration: number,
    number_of_attempts: number,
}