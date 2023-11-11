<template>
  <div class="post-management">
    <h1>Post Management</h1>

    <div class="post-form">
      <h2>Create/Edit Post</h2>
      <form @submit.prevent="savePost">
        <label for="title">Title:</label>
        <input type="text" v-model="newPost.title" required>

        <label for="description">Description:</label>
        <textarea v-model="newPost.description" required></textarea>

        <label for="author">Author:</label>
        <input type="text" v-model="newPost.author" required>

        <button type="submit">Save Post</button>
      </form>
    </div>

    <div class="all-posts">
      <h2>All Posts</h2>
      <ul>
        <li v-for="(post, index) in posts" :key="index" class="post-item">
          <strong>{{ post.title }}</strong> - {{ post.description }} - {{ post.author }}
          <button @click="editPost(index)">Edit</button>
          <button @click="removePost(index)">Remove</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);
const newPost = ref({ title: '', description: '', author: '' });
let editingIndex = ref(null);

const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:8080/posts');
    posts.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

const savePost = async () => {
  try {
    if (editingIndex.value !== null) {
      const response = await axios.put(`http://localhost:8080/posts/${posts.value[editingIndex.value].id}`, newPost.value);
      posts.value[editingIndex.value] = response.data;
      editingIndex.value = null;
    } else {
      const response = await axios.post('http://localhost:8080/posts', newPost.value);
      posts.value.push(response.data);
    }

    newPost.value = { title: '', description: '', author: '' };
  } catch (error) {
    console.error(error);
  }
};

const editPost = (index) => {
  newPost.value = { ...posts.value[index] };
  editingIndex.value = index;
};

const removePost = async (index) => {
  try {
    const response = await axios.delete(`http://localhost:8080/posts/${posts.value[index].id}`);
    if (response.status === 200) {
      posts.value.splice(index, 1);
    } else {
      console.error('Failed to delete post');
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchPosts);
</script>

<style>
body{
  background: #6e6e6e;
}
h1{
  color: #000000;
  font-size: 60px;
}
.post-management {
  max-width: 800px;
  margin: auto;
}

.post-form, .all-posts {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.post-item {
  margin-top: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-item button {
  margin-left: 10px;
  background-color: #d9534f;
  color: white;
  border: none;
  cursor: pointer;
}

.post-item button:hover {
  background-color: #c9302c;
}
</style>