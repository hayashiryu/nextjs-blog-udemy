import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Layout, { siteTitle } from "../components/layout.js";
import utilStyles from "../styles/utils.module.css";
import { getPostsData } from "../lib/post.js";

//SSGの場合
export async function getStaticProps() {
  const allPostsData = getPostsData();//id, date, title, thumbnail
  console.log(allPostsData);

  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return <Layout home>
    <Head>
    <title> {siteTitle} </title>
    </Head>
    <section className={utilStyles.headingMd}>
      <p>
        私は新人エンジニアです。
      </p>
    </section>

    <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
      <h2>📝新人ブログ</h2>
      <div className={styles.grid}>
        {allPostsData.map(({id, title, date, thumbnail}) => (
        <article key={id}>
          <Link href={`/posts/${id}`}>
            <img 
              src={`${thumbnail}`} 
              className={styles.thumbnailImage}>
            </img> 
          </Link>
          <Link href={`/posts/${id}`}>
            <a className={utilStyles.boldText}>
              {title}
            </a>
          </Link>
          <br />
          <small className={utilStyles.lightText}>
            {date}
          </small>
        </article>
        ))}

      </div>
    </section>

  </Layout>;
}
