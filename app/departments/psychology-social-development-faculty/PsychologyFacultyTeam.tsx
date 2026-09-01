import { AcademicProfileCard } from "@/app/components/AcademicProfileCard";
import { psychologyFacultyTeam } from "@/lib/psychology-faculty-team";

export function PsychologyFacultyTeam() {
  return (
    <section className="programme-team psychology-faculty-team" id="faculty-team">
      <div className="wrap">
        <div className="sec-head programme-team-head">
          <div>
            <div className="idx">05 / Науково-педагогічний склад</div>
            <h2>Команда факультету</h2>
          </div>
          <p>
            Психологи, медики, соціальні працівники, педагоги й дослідники, які
            формують освітні програми, практичну підготовку та наукові напрями.
          </p>
        </div>
        <div className="academic-profile-grid">
          {psychologyFacultyTeam.map((person, index) => (
            <AcademicProfileCard
              key={person.id}
              index={index}
              badge={person.lead ? "Керівництво факультету" : undefined}
              person={{
                name: person.name,
                role: person.role,
                summary: person.summary,
                image: person.image,
                imageCrop: person.photoHasCaption ? "caption" : undefined,
                tags: person.interests,
                links: person.profiles || [],
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
