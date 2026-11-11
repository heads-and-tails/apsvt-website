"use client";

import { useEffect, useRef } from "react";
import { entranceExamRecordingGroups } from "@/lib/entrance-exam-recordings";
import styles from "./EntranceExamRecordings.module.css";

export function EntranceExamRecordings() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const revealRecording = () => {
      const id = window.location.hash.slice(1);
      if (id !== "entrance-videos" && !entranceExamRecordingGroups.some((group) => group.id === id)) return;
      const folder = root.current?.querySelector("details");
      if (folder) folder.open = true;
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement && root.current?.contains(target)) target.open = true;
    };
    revealRecording();
    window.addEventListener("hashchange", revealRecording);
    return () => window.removeEventListener("hashchange", revealRecording);
  }, []);

  const count = entranceExamRecordingGroups.reduce((total, group) => total + group.recordings.length, 0);

  return <article className="entrance-results-level" id="entrance-videos" ref={root}>
    <details className="entrance-session-folder entrance-result-batch">
      <summary>
        <span>03 / Відеозаписи</span>
        <div><small>{count} відеозаписів · YouTube</small><h3>Відеозаписи вступних випробувань</h3></div>
        <i aria-hidden="true">+</i>
      </summary>
      <div className={styles.groups}>
        {entranceExamRecordingGroups.map((group) => <details className={styles.group} id={group.id} key={group.id}>
          <summary><h4><time dateTime={group.date}>{group.label}</time></h4><span>{group.recordings.length} {group.recordings.length === 1 ? "відеозапис" : "відеозаписи"}</span><b aria-hidden="true">+</b></summary>
          <div className={`entrance-result-documents ${styles.documents}`}>
            {group.recordings.map((recording, index) => <a href={`https://www.youtube.com/watch?v=${recording.videoId}`} target="_blank" rel="noopener noreferrer" key={recording.videoId}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{group.label}</small><h5>{recording.title}</h5></div>
              <div className="entrance-result-action"><small>YouTube</small><b>Переглянути ↗</b></div>
            </a>)}
          </div>
        </details>)}
      </div>
    </details>
  </article>;
}
