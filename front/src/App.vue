<template>
  <div class="post-management">
    <h1>Post Management</h1>

    <div class="post-form">
      <h2>Create/Edit Post</h2>
      <form @submit.prevent="savePost">
        <label for="title">Title:</label>
        <input type="text" v-model="newPost.title" required />

        <label for="description">Description:</label>
        <textarea v-model="newPost.description" required></textarea>

        <label for="author">Author:</label>
        <input type="text" v-model="newPost.author" required />

        <button type="submit" class="btn-save">Save Post</button>
      </form>
    </div>

    <div class="all-posts">
      <h2>All Posts</h2>
      <ul>
        <li v-for="(post, index) in posts" :key="index" class="post-item">
          <div class="post-title">{{ post.title }}</div>
          <div class="post-description">{{ post.description }}</div>
          <div class="post-author">Author: {{ post.author }}</div>
          <div class="post-actions">
            <button @click="editPost(index)" class="btn-edit">Edit</button>
            <button @click="removePost(index)" class="btn-remove">Remove</button>
          </div>
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
body {
  background-color: #ffe4e1; /* Ніжно-рожевий фон */
  color: #8b004f; /* Темно-рожевий текст */
  font-family: Arial, sans-serif;
}

h1 {
  color: #d10068; /* Насичений рожевий */
  text-align: center;
  font-size: 36px;
}

.post-management {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

.post-form, .all-posts {
  background-color: #ffc1cc; /* Світло-рожевий фон секцій */
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #ff80ab; /* Яскравий рожевий */
  border-radius: 5px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ff99b6; /* Світло-рожевий обвід */
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #ffe6eb; /* Легкий рожевий */
}

button {
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  color: white;
}

button:hover {
  opacity: 0.9;
}

.btn-save {
  background-color: #e91e63; /* Рожево-червоний */
}

.btn-edit {
  background-color: #ff4081; /* Яскравий рожевий */
  margin-right: 10px;
}

.btn-remove {
  background-color: #d81b60; /* Темно-рожевий */
}

.post-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
  padding: 20px;
  border: 1px solid #ff80ab;
  border-radius: 10px;
  background-color: #ffe6eb; /* Легкий рожевий */
  box-shadow: 0 4px 6px rgba(216, 27, 96, 0.2); /* Темно-рожевий тінь */
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #d10068;
}

.post-description {
  font-size: 14px;
  margin-bottom: 12px;
  color: #8b004f;
}

.post-author {
  font-size: 12px;
  font-style: italic;
  color: #ff4081;
  margin-bottom: 12px;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
</style>
