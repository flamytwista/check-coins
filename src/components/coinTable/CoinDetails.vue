<template>
  <div class="coin-details">
    <the-image
      class="coin-details__img"
      :src="imgUrl"
      src-incorrect="https://coincap.io/static/logo_mark.png"
    />

    <div class="coin-details__texts">
      <p class="coin-details__name">
        {{ asset.name }}
      </p>
      <p class="text text--small coin-details__code">
        {{ asset.symbol }}
      </p>
    </div>
  </div>
</template>

<script>

import Asset from '@/orm/Asset'
import TheImage from '@/components/misc/TheImage'


export default {
  components: { TheImage },
  props: {
    asset: {
      type: Asset,
      required: true,
    },
  },
  computed: {
    imgUrl() {
      const codeLC = this.asset.symbol.toLowerCase()
      return `https://static.coincap.io/assets/icons/${codeLC}@2x.png`
    },
  },
}
</script>

<style scoped lang="scss">
.coin-details {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  .coin-details__img {
    width: 50px;
    height: 50px;
    margin-right: $gap;
  }
  .coin-details__texts {
    min-width: 0;   // flex specification fix
  }
  .coin-details__name {
    margin-bottom: 0.5em;

    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .coin-details__code {
    margin-top: 0.5em;
  }
}
</style>
