import { Octokit } from "@octokit/rest";
import matter from 'gray-matter';
import {remark} from 'remark'
import remarkEmbedder from '@remark-embedder/core'
import html from 'remark-html'
export interface NewsPostProps{
    title: string
    content: string
    authors: string[]
    date: Date
    thumbnail_url: string
    carousel_url: string
    published: boolean
    summary: string
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

const YoutubeVideoTransformer = {
  name: 'YoutubeVideo',
  shouldTransform(url: string) {
    const {host, pathname} = new URL(url)

    return (
      ['youtube.com', 'www.youtube.com'].includes(host) &&
      pathname.includes('/watch')
    )
  },
  getHTML(url: string) {
    const iframeUrl = url.replace('/watch?v=', '/embed/')
    const result = `<iframe src="${iframeUrl}" style="width:100%; height:500px"></iframe>`
    return result
  },
}

function validatePost(blob: any): NewsPostProps {
  // Ensure that the payload received from the api is valid
 const {data, content} = matter(blob);

 return {title: data.title,
         content: content,
         authors: data.authors,
         date: new Date(data.date),
         tags: data.tags,
         thumbnail_url: data.thumbnail_url,
         carousel_url: data.carousel_url,
         summary: data.summary,
         published: data.published}
}

export async function getPosts({owner, repo, postsPath, publishedOnly}: PostApi) {
    const postData = (await octokit.repos.getContent({owner, repo, path: postsPath})).data;
    
    // type narrowing
    if (!Array.isArray(postData)) {return}
    
    const initCollection: NewsPostProps[] = [];
    
    const postsReducer = async (collection: Promise<NewsPostProps[]>, d: any) => {
      const download_url = d.download_url!;
      const response = await fetch(download_url)
      const post = validatePost(await response.text());
      if (!post.published && publishedOnly){
        return [...(await collection)]
      }
      else {
      post.content = String(await remark()
        .use(remarkEmbedder, {
          transformers: [YoutubeVideoTransformer]
        }).use(html, {sanitize: false})
        .process(post.content));
      return [...(await collection), post]
    }
    }
    
    const postsFiltered = postData.reduce(postsReducer, Promise.resolve(initCollection));
    return postsFiltered
}
