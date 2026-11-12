type ScheduleDocument = {
  title: string;
  dates: string;
  href: string;
  pages: number;
};

type ScheduleStream = {
  id: string;
  number: string;
  dates: string;
  documents: readonly ScheduleDocument[];
};

type ScheduleLevel = {
  id: string;
  index: string;
  title: string;
  heading: string;
  dates: string;
  streams: readonly ScheduleStream[];
};

const directory = "/documents/admissions/entrance-exams/streams-2026";

export const entranceScheduleLevels: readonly ScheduleLevel[] = [
  {
    id: "entrance-bachelor", index: "01", title: "Бакалаврат", heading: "Співбесіди", dates: "Липень · вересень · жовтень",
    streams: [
      { id: "entrance-bachelor-stream-1", number: "І", dates: "15–31 липня 2026", documents: [
        { title: "Співбесіди замість НМТ", dates: "15 та 29 липня 2026", href: `${directory}/bachelor-stream-1-nmt-2026.pdf`, pages: 1 },
        { title: "Співбесіди для здобуття другої вищої освіти", dates: "16, 17, 30 та 31 липня 2026", href: `${directory}/bachelor-stream-1-second-degree-2026.pdf`, pages: 3 },
      ] },
      { id: "entrance-bachelor-additional", number: "ІІ", dates: "8–11 вересня 2026", documents: [
        { title: "Графік проведення співбесід", dates: "Консультація — 8 вересня; співбесіди — 9 та 11 вересня 2026", href: `${directory}/bachelor-stream-2-2026.pdf`, pages: 1 },
      ] },
      { id: "entrance-bachelor-stream-3", number: "ІІІ", dates: "7–8 жовтня 2026", documents: [
        { title: "Графік проведення співбесід", dates: "Консультація — 7 жовтня; співбесіда — 8 жовтня 2026", href: `${directory}/bachelor-stream-3-2026.pdf`, pages: 1 },
      ] },
    ],
  },
  {
    id: "entrance-master", index: "02", title: "Магістратура", heading: "Співбесіди та фахові іспити", dates: "Серпень · вересень",
    streams: [
      { id: "entrance-master-stream-1", number: "І", dates: "6–19 серпня 2026", documents: [
        { title: "Графік співбесід і фахових іспитів", dates: "Співбесіди — 6 та 18 серпня; фахові іспити — 7 та 19 серпня 2026", href: `${directory}/master-stream-1-2026.pdf`, pages: 4 },
      ] },
      { id: "entrance-master-additional", number: "ІІ", dates: "15–17 вересня 2026", documents: [
        { title: "Графік співбесід і фахових іспитів", dates: "Консультація — 15 вересня; співбесіди — 16 вересня; фахові іспити — 17 вересня 2026", href: `${directory}/master-stream-2-2026.pdf`, pages: 4 },
      ] },
    ],
  },
  {
    id: "entrance-phd", index: "03", title: "Аспірантура", heading: "Вступні випробування", dates: "Серпень · жовтень",
    streams: [
      { id: "entrance-phd-stream-1", number: "І", dates: "21–26 серпня 2026", documents: [
        { title: "Графік вступних випробувань", dates: "21, 25 та 26 серпня 2026", href: `${directory}/phd-stream-1-2026.pdf`, pages: 2 },
      ] },
      { id: "entrance-phd-additional", number: "ІІІ", dates: "7–9 жовтня 2026", documents: [
        { title: "Графік вступних випробувань", dates: "Консультація та вступні випробування — 7–9 жовтня 2026", href: `${directory}/phd-stream-3-2026.pdf`, pages: 2 },
      ] },
    ],
  },
];

export const entranceScheduleAliases = entranceScheduleLevels.flatMap((level) => [level.id, ...level.streams.map((stream) => stream.id)]);
