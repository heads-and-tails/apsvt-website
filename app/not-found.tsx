import Link from "next/link";
export default function NotFound(){return <main className="not-found"><span>404</span><h1>Цієї сторінки<br />ще немає.</h1><p>Поверніться до головної або досліджуйте останні історії Академії.</p><div><Link href="/">На головну</Link><Link href="/news">До медіа</Link></div></main>}
