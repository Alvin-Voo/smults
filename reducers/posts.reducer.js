/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^isEqual|^intersection|^pick" }] */
import { isEqual, intersection, pick } from 'lodash';
import removeMd from 'remove-markdown';
import moment from 'moment';
import { POSTFIELDS, DEFAULTIMG } from '../config';
import { STORE_SELECTED_TAGS, FETCH_AND_FILTER_POSTS } from '../actions';

const initialState = {
  posts: [],
  selectedTags: [],
  firstTagIsCategory: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case STORE_SELECTED_TAGS:
      return { ...state, selectedTags: [...action.payload.tags], firstTagIsCategory: action.payload.checkedCategory };
    case FETCH_AND_FILTER_POSTS: {
      // [...c].map(it=> {return _.pick(it,['id'])})
      const posts = [...action.payload].filter((post) => {
        // first get the tags
        const json = JSON.parse(post.json_metadata);
        const tags = json.tags ? json.tags : '';
        if (tags === '') return false;
        const selectedTags = [...state.selectedTags];
        const { firstTagIsCategory } = state;

        let ret = false;
        // if check box is ticked, check whether first tag equals to selected first tag
        if (firstTagIsCategory) {
          if (selectedTags[0] === tags[0]) ret = _.isEqual(selectedTags, _.intersection(selectedTags, tags));
        } else {
          // source should contain all the selected tags, regardless of the order
          // if after intersect is equal back to the selected tags, means it matches
          ret = _.isEqual(selectedTags, _.intersection(selectedTags, tags));
        }

        return ret;
      }).map((post) => {
        // clean up json_metadata, filter out image[0] and tags only
        // clean up markdown, save back to body
        // before returning the array
        const fPost = _.pick(post, POSTFIELDS);
        const json = JSON.parse(post.json_metadata);
        const tags = json.tags ? json.tags : '';
        const image = json.image ? json.image[0] : DEFAULTIMG;
        const fBody = `${removeMd(post.body, { useImgAltText: false }).substring(0, 120).replace(/[\r\n]/g, ' ')}...`;
        const fCreated = moment.utc(post.created).fromNow();

        // add back to fPost
        fPost.image = image;
        fPost.tags = tags;
        fPost.body = fBody;
        fPost.created = fCreated;
        fPost.url = `https://steemit.com${fPost.url}`;

        return fPost;
      });

      return { ...state, posts };
    }
    default:
      return state;
  }
}
