import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

//process.cwd()はカレントディレクトリを指す
const postsDirectory = path.join(process.cwd(), "posts");

//mdファイルのデータを取り出す
export function getPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, "");//ファイル名(id)

        //マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf-8");

        //メタデータも取り出す
        const matterResult = matter(fileContents);


        //idとデータを返却
        //．．．はスプレッド構文で、title,path、thumbnailをひとつづつ取り出している   
        return {
            id,
            ...matterResult.data,
        };  
    });
    return allPostsData;
}

//getStaticPathでreturnで使うPathを取得する(オブジェクトで)
export function getAllPostIds(){
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return{
            params: {
                id: fileName.replace(/\.md$/, ""),
            },
        };
    });
};

/*返される例
[
    {
        params: {
            id: "ssg-ssr"
        }
    },
    {
        params: {
            id: "next-react"
        }
    },
]
*/

//idに基づいてブログ投稿データを返す
export async function getPostData(id){
    //file中身を取得するためにフルパス取得
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContent = fs.readFileSync(fullPath, "utf-8");

    //metaデータを解析する、mattterResult.dataはめたデータ、.contentで中身を見れる
    const matterResult = matter(fileContent);

    const blogContent = await remark().use(html).process(matterResult.content);

    const blogContentHTML = blogContent.toString();

    return {
        id,
        blogContentHTML,
        ...matterResult.data,
    };
}
