import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Unauthorized access attempt:", userError?.message);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 유저의 학습 시간 정보 조회
  const { data: userAnswers, error: userAnswersError } = await supabase
    .from("user_answers")
    .select("answers, timezone")
    .eq("user_id", user.id)
    .single();

  if (userAnswersError || !userAnswers) {
    console.error("Error fetching user answers:", userAnswersError?.message);
    return NextResponse.json(
      { error: "User answers not found" },
      { status: 404 }
    );
  }

  const practiceTime = userAnswers.answers[5]; // Access the answer to question 5
  const userTimezone = userAnswers.timezone;

  const practiceTimeMap: { [key: string]: number } = {
    1: 7, // 7AM
    2: 9, // 9AM
    3: 13, // 1PM
    4: 18, // 6PM
    5: 21, // 9PM
  };

  const practiceHour = practiceTimeMap[practiceTime];
  if (practiceHour === undefined) {
    return NextResponse.json(
      { error: "Invalid practice time selected." },
      { status: 400 }
    );
  }

  const now = new Date();
  const nowInUserTimezone = new Date(
    now.toLocaleString("en-US", { timeZone: userTimezone })
  );
  const practiceDateTime = new Date(nowInUserTimezone);
  practiceDateTime.setHours(practiceHour, 0, 0, 0);

  // 학습 시간이 지난 경우, 새로운 단어를 추천
  if (practiceDateTime < nowInUserTimezone) {
    const date = practiceDateTime.getDate();
    practiceDateTime.setDate(date + 1);
  }

  // 유저의 마지막 학습 이력 조회
  const { data: lastUserWords, error: userWordsError } = await supabase
    .from("user_words")
    .select("*")
    .eq("user_id", user.id)
    .order("seen_at", { ascending: false })
    .limit(1)
    .single();

  let seenWordIds = [];
  if (lastUserWords && lastUserWords.word_ids) {
    const lastSeenAt = new Date(
      lastUserWords.seen_at.toLocaleString("en-US", { timeZone: userTimezone })
    );
    if (lastSeenAt <= practiceDateTime) {
      // 마지막 학습 시간이 아직 유효한 경우, 기존 단어 반환
      // lastUserWords.word_ids 값들을 이용해서 "words" 테이블에서 단어들을 가져오기
      const { data: words, error: wordsError } = await supabase
        .from("words")
        .select("*")
        .in("id", lastUserWords.word_ids);

      if (wordsError) {
        console.error("Error fetching words:", wordsError.message);
        return NextResponse.json(
          { error: wordsError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ words: words });
    }
    seenWordIds = lastUserWords.word_ids;
  }

  // 사용자가 보지 않은 단어 조회
  const { data: words, error: wordsError } = await supabase
    .from("words")
    .select("*")
    .not("id", "in", `(${seenWordIds.join(",")})`);

  if (wordsError) {
    console.error("Error fetching words:", wordsError.message);
    return NextResponse.json({ error: wordsError.message }, { status: 500 });
  }

  const topics = [1, 2, 3, 4, 5];
  const recommendedWords = topics
    .map((topic) => {
      const wordsInTopic = words.filter((word: any) => word.topic === topic);
      return wordsInTopic[Math.floor(Math.random() * wordsInTopic.length)];
    })
    .filter(Boolean);

  const recommendedWordIds = recommendedWords.map((word: any) => word.id);

  // 새 row 생성
  const { error: insertError } = await supabase.from("user_words").insert({
    user_id: user.id,
    word_ids: recommendedWordIds,
    seen_at: new Date(),
  });

  if (insertError) {
    console.error("Error inserting user words:", insertError.message);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ words: recommendedWords });
}
