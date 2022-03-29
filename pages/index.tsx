import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <Link href="/trackers">
      <a>Trackers</a>
    </Link>
  );
};

export default Home;
