import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/">products</Link>
      <Link href="/">sell</Link>
      <Link href="/">orders</Link>
      <Link href="/">account</Link>
    </nav>
  );
}
