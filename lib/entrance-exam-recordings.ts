export type EntranceExamRecordingGroup = {
  id: string;
  date: string;
  label: string;
  recordings: { title: string; videoId: string }[];
};

export const entranceExamRecordingGroups: readonly EntranceExamRecordingGroup[] = [
  {
    "id": "entrance-videos-2026-07-29",
    "date": "2026-07-29",
    "label": "29 липня 2026 року",
    "recordings": [
      {
        "title": "Запис 1",
        "videoId": "H8W4q7wpZHA"
      },
      {
        "title": "Запис 2",
        "videoId": "jBp31e3DJeI"
      }
    ]
  },
  {
    "id": "entrance-videos-2026-07-31",
    "date": "2026-07-31",
    "label": "31 липня 2026 року",
    "recordings": [
      {
        "title": "Запис 1",
        "videoId": "5plYKGeALG8"
      }
    ]
  },
  {
    "id": "entrance-videos-2026-08-06",
    "date": "2026-08-06",
    "label": "6 серпня 2026 року",
    "recordings": [
      {
        "title": "Запис 1",
        "videoId": "EtoszEztJPI"
      },
      {
        "title": "Запис 2",
        "videoId": "mmfbrrJVL_Q"
      }
    ]
  },
  {
    "id": "entrance-videos-2026-08-18",
    "date": "2026-08-18",
    "label": "18 серпня 2026 року",
    "recordings": [
      {
        "title": "Запис 1",
        "videoId": "ouII-LD5AAc"
      },
      {
        "title": "Запис 2",
        "videoId": "PxWUNVlDbZM"
      }
    ]
  },
  {
    "id": "entrance-videos-2026-09-16",
    "date": "2026-09-16",
    "label": "16 вересня 2026 року",
    "recordings": [
      {
        "title": "Запис 1",
        "videoId": "1a4agEqSD6k"
      }
    ]
  },
  {
    "id": "entrance-videos-2026-10-09",
    "date": "2026-10-09",
    "label": "9 жовтня 2026 року",
    "recordings": [
      {
        "title": "Запис 1",
        "videoId": "hsDBHv3_mjg"
      },
      {
        "title": "Запис 2",
        "videoId": "rmvW-qVkHMw"
      }
    ]
  }
];
