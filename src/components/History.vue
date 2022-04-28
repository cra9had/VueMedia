<template>
  <div>
    <a :href="api_host">назад</a>
    <div v-for="(history, index) in history" :key="index">
      <div class="contentImageContainer">
        <img class="contentImage" :src="api_host + history.media_content.media_file" v-if="history.media_content.media_type === '1'">
        <video class="video-fluid z-depth-1" loop controls muted v-else-if="history.media_content.media_type === '2'">
          <source :src="api_host + history.media_content.media_file" type="video/mp4" />
        </video>
        <audio controls="controls" v-else>
          <source :src="api_host + history.media_content.media_file" type="audio/mpeg" />
        </audio>
      </div>
      <p style="display:flex;">{{index + 1}}. <span v-for="(tag, inx) in history.tags" :key="inx">&nbsp;{{tag.body}}</span></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'History',
  data () {
    return {
      history: [],
      api_host: this.$api_host.substring(0, this.$api_host.length - 1)
    }
  },

  async mounted () {
    await this.getChosenMedia()
  },

  methods: {
    async getChosenMedia () {
      const response = await fetch(this.$api_host + 'content/choose', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'token ' + localStorage.token
        }
      })
      console.log(await response.status)
      this.history = await response.json()
    }
  }
}
</script>

<style scoped>
.contentImageContainer {
  max-width: 300px;
  max-height: 300px;
}
.contentImage {
  width: 100%;
}
.video-fluid {
  width: 100%;
  height: auto;
}
</style>
