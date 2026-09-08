import Link from "next/link";

type StudentRepresentative = {
  name: string;
  role: string;
  image: string;
  bio: string;
  interests: string[];
  phone?: string;
  phoneHref?: string;
  email?: string;
  telegram?: string;
  quote?: string;
};

const studentRepresentatives: StudentRepresentative[] = [
  { name: "Мусійчук Марія", role: "Староста 1 курсу · представниця Ради факультету", image: "/people/marketing-students/maria-musiichuk.jpeg", bio: "Навчається на першому курсі та представляє інтереси групи у Раді факультету. Допомагає з організаційними питаннями, підтримує комунікацію між студентами й викладачами та долучається до студентських ініціатив.", interests: ["спорт", "подорожі", "іноземні мови", "читання"], phone: "+380 (98) 929 37 40", phoneHref: "+380989293740", email: "mariiamusiichuk8@gmail.com" },
  { name: "Самбурська Кіра", role: "Староста 2 курсу · D5 «Маркетинг»", image: "/people/marketing-students/kira-samburska.jpg", bio: "Студентка другого курсу, яка поєднує навчання з творчими та організаційними ініціативами. Розвиває лідерські навички й прагне реалізовувати себе у маркетингу.", interests: ["танці", "малювання", "події", "маркетинг"], phone: "+380 (95) 562 41 19", phoneHref: "+380955624119", email: "lissahokins@gmail.com", telegram: "@wonderveil" },
  { name: "Захарова Еліна", role: "Староста 3 курсу · D5 «Маркетинг»", image: "/people/marketing-students/elina-zakharova.jpg", bio: "Студентка третього курсу. Поєднує маркетингову освіту із SMM, створенням контенту, фотографією та моделінгом, застосовуючи знання у практичних проєктах.", interests: ["SMM", "контент", "фотографія", "спорт"], phone: "+380 (97) 015 83 29", phoneHref: "+380970158329", email: "ellimur001@gmail.com" },
  { name: "Сапітон Михайло", role: "Староста 4 курсу · D5 «Маркетинг»", image: "/people/marketing-students/mykhailo-sapiton.jpg", bio: "Студент четвертого курсу, який додатково навчається за напрямом міжнародної економіки та економічної дипломатії. Поєднує маркетинговий, економічний і глобальний погляд.", interests: ["автомобілі", "автоспорт", "економіка", "міжнародні процеси"], phone: "+380 (67) 200 51 70", phoneHref: "+380672005170", email: "kommi9585dfl2017uk@gmail.com" },
  { name: "Морока Дарина", role: "Магістрантка D5 «Маркетинг» · секретарка наукового гуртка", image: "/people/marketing-students/daryna-moroka.jpg", bio: "Навчається у магістратурі з маркетингу та на бакалавраті з психології. Працює з міжнародними й іноземними студентами, є членкинею Приймальної комісії Академії.", interests: ["читання", "подорожі Україною", "міжкультурна комунікація", "кулінарія"], phone: "+380 (99) 912 50 25", phoneHref: "+380999125025" },
  { name: "Богідаєв Андрій", role: "Магістрант D5 «Маркетинг» · представник факультету у Вченій раді", image: "/people/marketing-students/andrii-bohidaiev.jpg", bio: "Магістрант першого курсу та представник студентів факультету у Вченій раді Академії. Володіє англійською і французькою мовами, бере участь у міжнародних конференціях.", interests: ["музика", "кіно", "фотографія", "мови"], phone: "+380 (96) 448 55 86", phoneHref: "+380964485586", email: "farvordelsag@gmail.com" },
  { name: "Ніконова Олександра", role: "Староста 1 курсу магістратури · D5 «Маркетинг»", image: "/people/marketing-students/oleksandra-nikonova.jpg", bio: "Має досвід адміністративної та операційної роботи, міжнародних проєктів, координації команд і подій. Розвивається у комунікаціях, створенні контенту та психології.", interests: ["психологія", "події", "фото й відео", "публічні виступи"], phone: "+380 (97) 380 28 25", phoneHref: "+380973802825", email: "alexandranovaonline@gmail.com" },
  { name: "Бугай Олег", role: "Староста 2 курсу магістратури · D5 «Маркетинг»", image: "/people/marketing-students/oleh-buhai.jpg", bio: "Засновник і керівник Marketing Studio LEON. Має понад 15 років досвіду у цифровому маркетингу та бізнесі, працював із проєктами й професійними подіями у понад 20 країнах.", interests: ["digital-маркетинг", "підприємництво", "відео", "подорожі"], quote: "Постійно навчатися і розвиватися, поєднуючи теорію з практикою.", phone: "+38 (050) 381 06 21", phoneHref: "+380503810621", email: "studioleon.net@gmail.com" },
  { name: "Віола Пінчук", role: "Голова студентського самоврядування АПСВТ", image: "/people/marketing-students/viola-pinchuk.jpg", bio: "Навчається за напрямами публічного управління та права. Розвиває студентські проєкти, об’єднує людей навколо корисних ініціатив і допомагає перетворювати ідеї на результат.", interests: ["студентські проєкти", "право", "публічне управління", "комунікація"], quote: "Ідеї мають значення, коли знаходять людей, готових їх реалізувати." },
];

export function MarketingStudentLife() {
  return <section className="marketing-student-life" id="marketing-student-life">
    <div className="wrap">
      <div className="marketing-student-intro">
        <div><div className="idx">06 / Студентське життя</div><h2>Студентське самоврядування та студентський актив</h2></div>
        <p>Старости курсів, представники факультету та студентські лідери підтримують комунікацію, представляють інтереси здобувачів і розвивають спільні ініціативи.</p>
      </div>
      <div className="marketing-student-feature-grid">
        <article><span>01 / Науковий гурток</span><h3>MARKETHINK</h3><p>Матеріали гуртка та участі студентів кафедри у наукових заходах.</p><Link href="/materials/3331-0b35c55db.html">Відкрити матеріали →</Link></article>
        <article><span>02 / Представництво</span><h3>Голос студентів</h3><p>Студенти беруть участь у роботі факультету й Академії, організовують події та допомагають одне одному.</p><Link href="/students/council">Студентське самоврядування Академії →</Link></article>
      </div>
      <div className="marketing-student-roster-head"><span>09 представників</span><h3>Студентський актив кафедри</h3></div>
      <div className="marketing-student-roster">
        {studentRepresentatives.map((person, index) => <article className="marketing-student-card" key={person.name}>
          <div className="marketing-student-photo"><img src={person.image} alt={person.name} loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span></div>
          <div className="marketing-student-copy"><small>{person.role}</small><h3>{person.name}</h3><p>{person.bio}</p>{person.quote && <blockquote>«{person.quote}»</blockquote>}<ul>{person.interests.map((interest) => <li key={interest}>{interest}</li>)}</ul>
            {(person.phone || person.email || person.telegram) && <details><summary>Контакти <i>+</i></summary><div>{person.phone && <a href={`tel:${person.phoneHref}`}>{person.phone}</a>}{person.email && <a href={`mailto:${person.email}`}>{person.email}</a>}{person.telegram && <span>Telegram: {person.telegram}</span>}</div></details>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
