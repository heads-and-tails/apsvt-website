const enrollmentOrders = [
  {
    title: "Наказ про зарахування № 172/с",
    date: "12 серпня 2026",
    details: "Офіційний наказ і додатки про зарахування вступників на навчання.",
    pages: 38,
    href: "/documents/admissions/enrollment-orders/2026-08/order-172s-2026-08-12.pdf",
  },
  {
    title: "Наказ про зарахування № 173/с",
    date: "12 серпня 2026",
    details: "Офіційний наказ і додатки про зарахування вступників на навчання.",
    pages: 6,
    href: "/documents/admissions/enrollment-orders/2026-08/order-173s-2026-08-12.pdf",
  },
  {
    title: "Наказ про зарахування",
    date: "17 серпня 2026",
    details: "Офіційний документ Приймальної комісії з додатками до наказу.",
    pages: 11,
    href: "/documents/admissions/enrollment-orders/2026-08/order-2026-08-17.pdf",
  },
];

export function EnrollmentOrders() {
  return <section className="enrollment-orders" id="enrollment-orders"><div className="wrap">
    <div className="enrollment-orders-head">
      <div><div className="idx">07.1 / Приймальна комісія</div><h2>Накази про<br />зарахування</h2></div>
      <aside><b>Офіційні документи</b><p>Накази публікуються разом із додатками. Оберіть потрібну дату, щоб відкрити повний PDF.</p><span>Вступ 2026</span></aside>
    </div>

    <div className="enrollment-order-grid">
      {enrollmentOrders.map((order, index) => <a className="enrollment-order-card" href={order.href} target="_blank" rel="noreferrer" key={order.href}>
        <div className="enrollment-order-meta"><span>{String(index + 1).padStart(2, "0")}</span><small>{order.date}</small></div>
        <p>Приймальна комісія · PDF</p>
        <h3>{order.title}</h3>
        <div className="enrollment-order-footer"><span>{order.details}</span><b>{order.pages} стор. · Відкрити ↗</b></div>
      </a>)}
    </div>
  </div></section>;
}
