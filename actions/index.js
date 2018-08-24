import * as dsteem from 'dsteem'

export const FETCH_TRENDING_TAGS = 'FETCH_TRENDING_TAGS';
export const STORE_SELECTED_TAGS = 'STORE_SELECTED_TAGS';
export const FETCH_AND_FILTER_POSTS = 'FETCH_AND_FILTER_POSTS';
export const FILTER_POSTS = 'FILTER_POSTS';

const STEEM_API = 'https://api.steemit.com';
const MAX_TAGS = 16; //15 including the empty string
const MAX_POSTS = 100;
const client = new dsteem.Client(STEEM_API);

export function fetchTrendingTags(){
  const request = client.database.call('get_trending_tags', [
      "",
      MAX_TAGS,
  ]);
  return{
      type: FETCH_TRENDING_TAGS,
      payload: request
  };
}

function storeSelectedTags(tags){
  return{
    type: STORE_SELECTED_TAGS,
    payload: tags
  }
}

function fetchAndFilterPosts(tag,filter){
  const request = client.database.getDiscussions(filter,{tag,limit: MAX_POSTS});

  return{
    type: FETCH_AND_FILTER_POSTS,
    payload: request//--> to redux promise
  }
}

//1. store selected tags, 2. fetch posts based on first tag, 3. filter post with XOR function
export function fetchPosts(tags,filter){
  if(tags.length===0)return;
  return(dispatch)=>{

    dispatch(storeSelectedTags(tags));
    dispatch(fetchAndFilterPosts(tags[0],filter));
  };
}