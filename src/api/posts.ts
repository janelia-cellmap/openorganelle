import { Octokit } from "@octokit/rest";
import matter from 'gray-matter';
import { visit } from 'unist-util-visit';
import {remark} from 'remark'

export interface NewsPostProps{
    title: string
    content: string
    authors: string[]
    date: Date
    published: boolean
    tags: string[]
}

export interface PostApi {
  owner: string
  repo: string
  postsPath: string
  assetsPath: string
  publishedOnly: boolean
}

const octokit = new Octokit({});

function transformImgSrc(url: string) {
  // resolve relative paths in image URLs
  return (tree: any, file: any) => {
    visit(tree, 'paragraph', node => {
      const image = node.children.find((child: any) => child.type === 'image');
      if (image) {
        image.url = image.url.replace('../', url);
      }
    });
  };
}

function validatePost(blob: any): NewsPostProps {
  // Ensure that the payload received from the api is valid
 const {data, content} = matter(blob);
 
 return {title: data.title,
         content: content, 
         authors: data.authors, 
         date: new Date(data.date),
         tags: data.tags,
         published: data.published}
}

export async function getPosts({owner, repo, postsPath, publishedOnly}: PostApi) {
    const postData = (await octokit.repos.getContent({owner, repo, path: postsPath})).data;
    
    // type narrowing
    if (!Array.isArray(postData)) {return}

    const postsReducer = async (collection: Promise<NewsPostProps[]>, d: any) => {
      const download_url = d.download_url!;
      const response = await fetch(download_url)
      const post = validatePost(await response.text());
      if (!post.published && publishedOnly){
        return [...(await collection)]
      }
      else {
      // resolve relative paths in image URIs, e.g. ../assets/image.png -> https://domain.com/assets/image.png
      post.content = String(await remark().use(transformImgSrc, download_url.replace(d.path, '')).process(post.content));
      return [...(await collection), post]
    }
    }
    let initCollection: NewsPostProps[] = [];
    const postsFiltered = postData.reduce(postsReducer, Promise.resolve(initCollection));
    return postsFiltered
}
