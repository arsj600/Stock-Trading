import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../axiosInstance";

const API_URL = import.meta.env.VITE_API_BASE;


export const fetchPosts = createAsyncThunk("social/fetchPosts", async () => {
  const res = await API.get(`${API_URL}api/posts`);
  return res.data.posts;
});

export const createPost = createAsyncThunk(
  "social/createPost",
  async ({ content }, { getState }) => {
    const { token } = getState().auth;
    const res = await API.post(
      `${API_URL}api/posts`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.post;
  }
);

export const updatePost = createAsyncThunk(
  "social/updatePost",
  async ({ id, content }, { getState }) => {
    const { token } = getState().auth;
    const res = await API.put(
      `${API_URL}api/posts/${id}`,
      { content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.post;
  }
);

export const deletePost = createAsyncThunk(
  "social/deletePost",
  async (id, { getState }) => {
    const { token } = getState().auth;
    await API.delete(`${API_URL}api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  }
);

// Slice
const socialSlice = createSlice({
  name: "social",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {
    // socket-driven
    addPost: (state, action) => {
      const exists = state.posts.find((p) => p._id === action.payload._id);
      if (!exists) {
        state.posts.unshift(action.payload);
      }
    },
    editPost: (state, action) => {
      const idx = state.posts.findIndex((p) => p._id === action.payload._id);
      if (idx !== -1) {
        state.posts[idx] = action.payload;
      }
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((p) => p._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.posts[idx] = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      });
  },
});

export const { addPost, editPost, removePost } = socialSlice.actions;
export default socialSlice.reducer;
