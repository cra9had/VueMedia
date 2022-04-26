<template>
  <div>
    <nav class="navbar navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">
          <img src="https://getbootstrap.com/docs/5.1/assets/brand/bootstrap-logo.svg" alt="" width="30" height="24">
        </a>
      </div>
      <div class="d-flex">
        <button type="button" class="btn btn-light" v-on:click="exit">Выйти</button>
      </div>
    </nav>

    <div class="dropdown-content" id="search">
      <input id="searchInput" class="form-control me-2" type="search" placeholder="Search" v-on:input="loadTags" aria-label="Search">
      <a v-for="tag in searchTags" :key="tag.body" v-on:click="addTag">{{tag.body}}</a>
    </div>
    <div class="tags">
    <div class="selectedTag row" v-on:click="deleteSelectedTag" v-for="tag in selectedTags" :key="tag.body">
      <p style="margin-bottom: 0; color: snow;">{{tag.body}}</p>
    </div>
    </div>
    <div class="content">
      <div class="contentCard" v-for="(card, idx) in content" :key="idx">
        <div class="contentImageContainer">
          <img class="contentImage" :src="api_host + card.media_file" v-if="card.media_type === '1'">
          <video class="video-fluid z-depth-1" loop controls muted v-else-if="card.media_type === '2'">
            <source :src="api_host + card.media_file" type="video/mp4" />
          </video>
          <audio controls="controls" v-else>
            <source :src="api_host + card.media_file" type="audio/mpeg" />
          </audio>
        </div>
        <span>{{card.title}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      searchTags: [],
      selectedTags: [],
      content: [],
      api_host: this.$api_host.substring(0, this.$api_host.length - 1)
    }
  },

  async mounted () {
    if (!await this.checkToken()) {
      await this.$router.push({ name: 'LoginPage' })
    }
  },
  methods: {
    exit () {
      localStorage.token = ''
      this.$router.push({ name: 'LoginPage' })
    },

    deleteSelectedTag (e) {
      const body = e.target.innerText
      for (let i = 0; i < this.selectedTags.length; i++) {
        if (this.selectedTags[i].body === body) {
          this.selectedTags.splice(i, 1) // 2nd parameter means remove one item only
          if (this.selectedTags.length > 0) {
            this.loadContent()
          } else {
            this.content = []
          }
        }
      }
    },

    deleteTags (e) {
      this.searchTags = []
    },

    addTag (e) {
      const body = e.target.innerText
      document.getElementById('searchInput').value = ''
      if (!this.selectedTags.some(e => e.body === body)) {
        this.selectedTags.push({ body: body })
        this.loadContent()
      }
      this.deleteTags()
    },

    async loadContent () {
      const tags = []
      for (let i = 0; i < this.selectedTags.length; i++) {
        tags.push({ body: this.selectedTags[i].body })
      }
      console.log(tags)
      const response = await fetch(this.$api_host + 'content/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token ' + localStorage.token
        },
        body: JSON.stringify({
          tags: tags
        })
      })
      this.content = await response.json()
    },
    async loadTags (e) {
      const searchTag = e.target.value
      if (!searchTag) {
        this.searchTags = []
        return
      }
      const response = await fetch(this.$api_host + 'content/tags?' + new URLSearchParams({
        body: searchTag
      }), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token ' + localStorage.token
        }
      })
      if (await response.status === 200) {
        this.searchTags = await response.json()
      }
    },
    async checkToken () {
      if (!localStorage.token) {
        return false
      }
      const response = await fetch(this.$api_host + 'account/check/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: localStorage.token
        })
      })
      return await response.status === 200
    }
  }
}
</script>

<style scoped>
.video-fluid {
  width: 100%;
  height: auto;
}

.contentCard {
  max-width: 300px;
}

.contentImage {
  width: 100%;
}

.contentImageContainer {
  max-width: 300px;
  max-height: 300px;
}

#search {
  margin-left: 10rem;
  margin-right: 10rem;
  margin-top: 5rem;
}
.dropdown-content {
  /*display: none;*/
  /*position: absolute;*/
  background-color: #f6f6f6;
  min-width: 230px;
  border: 1px solid #ddd;
  z-index: 1;
}
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.dropdown-content a:hover {background-color: #f1f1f1}

.selectedTag{
  display: inline-block;
  padding: 7px;
  border-radius: 16px;
  background-color: darkgray;
  line-height: normal;
  margin-left: 2rem;
}

.selectedTag:hover {
  text-decoration: line-through;
}

.tags {
  margin-top: 2rem;
  margin-right: 10rem;
  margin-left: 12rem;
  display: flex;
}

.content {
  display: grid;
  grid-template-columns: repeat(3, 300px);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  margin-top: 2rem;
}

</style>
