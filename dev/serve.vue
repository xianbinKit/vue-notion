<template>
  <div id="app">
    <NotionRenderer :blockMap="blockMap" fullPage prism todo />
  </div>
</template>

<script>
import { NotionRenderer, getPageBlocks } from "@/entry";
import "prismjs";
import "prismjs/themes/prism.css";
import axios from 'axios'
export default {
  name: "ServeDev",
  components: {
    NotionRenderer,
  },
  data() {
    return { blockMap: null };
  },
  async created() {
    // react-notion tester: 2e22de6b770e4166be301490f6ffd420
    // this.blockMap = await getPageBlocks("f77da07dd9ea4494928ddcf8ebeedec8");
    const pageId = 'e726171fa05643e08b52ffe276758a9b'

    var data = JSON.stringify({ "pageId": pageId });

    var config = {
      method: 'post',
      url: 'http://localhost:3000/getPageWithBlocks',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    const res = await axios(config)
    this.blockMap = res.data
    console.log('blockMap:', this.blockMap)
  },
};
</script>

<style>
@import "./../src/styles.css";
body {
  margin: 0;
}
</style>
