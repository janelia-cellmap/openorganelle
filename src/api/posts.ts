import { Octokit } from "@octokit/rest";
import matter from 'gray-matter';
import { PostsAPIProps } from "../context/AppContext";
import { visit } from 'unist-util-visit';
import {remark} from 'remark'
import remarkFrontmatter from "remark-frontmatter";

export interface NewsPostProps{
    title: string
    content: string
    authors: string[]
    date: Date
    tags: string[]
}

const octokit = new Octokit({});

function transformImgSrc(url: string) {
  return (tree: any, file: any) => {
    visit(tree, 'paragraph', node => {
      const image = node.children.find((child: any) => child.type === 'image');
      
      if (image) {
        image.url = image.url.replace('../', url);
      }
    });
  };
}

export async function getPosts({owner, repo, postsPath, assetsPath}: PostsAPIProps) {
    const postData = (await octokit.repos.getContent({owner, repo, path: postsPath})).data;
    // type narrowing
    if (!Array.isArray(postData)) {return}
    const posts = await Promise.all(postData.map(async (d) => {
        const download_url = d.download_url!;
        const response = await fetch(download_url)
        const text = await response.text();
        const {data, content} = matter(text)
        // resolve relative paths in image URIs, e.g. ../assets/image.png -> https://domain.com/assets/image.png
        const parsed = await remark().use(transformImgSrc, download_url.replace(d.path, '')).process(content);
        return {title: data.title, content: String(parsed), authors: data.authors, date: new Date(data.date), tags: data.tags}
    }))
    return posts
}
