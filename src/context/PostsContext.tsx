import {createContext, useContext, useEffect, useReducer } from 'react'
import React from 'react'
import { getPosts, NewsPostProps, PostApi } from '../api/posts'

type Action = {type: 'set-posts', payload: NewsPostProps[]}
type Dispatch = (action : Action) => void


type PostState = {api: PostApi
                  posts: NewsPostProps[]
                 }

const initialState = {api: {owner: process.env.REACT_APP_POSTS_API_OWNER!,
                      repo: process.env.REACT_APP_POSTS_API_REPO!,
                      postsPath: process.env.REACT_APP_POSTS_API_POSTSPATH!,
                      assetsPath: process.env.REACT_APP_POSTS_API_ASSETSPATH!,
                      publishedOnly: true},
                      posts: []}
const PostsContext = createContext<
{state: PostState, dispatch: Dispatch} | undefined>(undefined)


function postsReducer(state: PostState, action: Action) {
    switch (action.type) {
        case 'set-posts': {
            return {...initialState, posts: action.payload}
        }
}
}

function setPosts(data: NewsPostProps[]): Action {
    return {
    type: 'set-posts',
    payload: data}
}

export function PostsProvider({children}: any) {
    const [state, dispatch] = useReducer(postsReducer, initialState)
    useEffect(() => {
        async function initPosts() {
            const posts = await getPosts(state.api);
            dispatch(setPosts(posts!))
        }
        initPosts();
    }, [])
    const value = {state, dispatch}
    return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
}

export function usePosts() {
    const context = useContext(PostsContext)
    if (context === undefined) {
        throw new Error('usePosts must be used within a PostsProvider')
    }
    return context
}
