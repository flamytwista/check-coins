import coinApi from '@/plugins/axios/coinApi'
import Asset from '@/orm/Asset'

// интервал в мс, чаще которого не показывать новые сделки
const msForDeals = 5000
const vuexModuleHelpers = {

  canUpdateVolumeChangeCounterByInterval(state, coinId) {

    const now = Date.now()

    const wasUpdatedBefore = state.assetVolumeChangeCounerUpdages[coinId]

    const wasUpdatedLongTimeAgo =
      state.assetVolumeChangeCounerUpdages[coinId]
      && state.assetVolumeChangeCounerUpdages[coinId].lastUpdateTS + msForDeals < now

    const can = (!wasUpdatedBefore || wasUpdatedLongTimeAgo)

    if (can) {
      state.assetVolumeChangeCounerUpdages[coinId] = {
        lastUpdateTS: now,
      }
    }

    return can
  },
}

// todo: заполнить
let unreactive = {

}
export default {
  state: {

    // todo: вынести все кеши наружу от state
    //  чтобы система реактивности vue ничего о них не знала
    //  это снизит нагрузку.
    /**
     * Кеш
     * Пример содержания:  {'bitcoin': {lastUpdateTS: timestamp}}
     */
    assetVolumeChangeCounerUpdages: {},

    /**
     * Кеш
     * Данные записываются сюда
     * когда пришла новая цена, но валюта не выведена в таблице (например непроскроллено).
     * Данные удаляются отсюда
     * когда валюта становится видимой в таблице (например пользователь доскроллил до валюты)
     * Пример содержания: {'bitcoin': {notUpdatedPrice: Number}}
     */
    notYetUpdatedPrices: {},

    /**
     * Кеш
     * Пример содержания: ['bitcoin']
     */

    visibleAssetIdsForTable: [],


    assetsPaginationIds: [],

  },

  actions: {
    // todo
    // 2 - сделать максимальную частоту обновления раз в 3 секунды
    SOCKET_ON_PRICE_CHANGE({ commit }, newPrices) {
      for (const coinId in newPrices) {
        // console.log('coinId')
        // if (coinId !== 'bitcoin') continue
        // if (coinId === 'ethereum') console.log('ethereum')

        const coinNewPrice = newPrices[coinId]
        // commit('updateOrPreCachePriceUsd', { coinId, coinNewPrice })
        Asset.dispatch('updateOrPreCachePriceUsd', { coinId, coinNewPrice })
      }
    },

    SOCKET_ON_VOLUME_CHANGE({ commit }, message) {
      // return
      commit('updateVolumeChangeCounter', { coinId: message.base })
      commit('updateVolumeChangeCounter', { coinId: message.quote })
    },
    /**
     *
     * @param state
     * @param assetId   Number
     */
    addVisibleAssetIdForTable(state, { assetId }) {
      Asset.commit((state) => {
        state.visibleAssetIdsForTable.push(assetId)
      })
    },
    /**
     *
     * @param state
     * @param assetId   Number
     */
    removeVisibleAssetIdForTable(state, { assetId }) {
      Asset.commit((state) => {
        state.visibleAssetIdsForTable = state.visibleAssetIdsForTable.filter((id) => id !== assetId)
      })
    },
    async fetchForPaginationTable({ state, commit, dispatch }) {
      const response = await coinApi.get('assets', {
        params: {
          limit: 100,
          offset: state.assetsPaginationIds.length,
        },
      })

      if (response.data.data.length) {
        const insertedData = await dispatch('insertOrUpdate', {
          data: response.data.data,
        })
        const insertedIds = insertedData.assets.map((asset) => asset.id)
        commit('addAssetsPaginationIds', { newIds: insertedIds })
      }

      return response
    },
    updatePriceUsd(state, { assetId, assetNewPrice }) {
      Asset.update({
        data: {
          id: assetId,
          priceUsd: assetNewPrice,
        },
      })
    },
    updatePriceUsdFromPreCache({ state }, { assetId }) {
      // console.log(state); console.log('^...state:')

      let assetFromPreCache = state.notYetUpdatedPrices[assetId]
      if (!assetFromPreCache) return

      const assetNewPrice = assetFromPreCache.notUpdatedPrice
      assetFromPreCache = undefined

      Asset.dispatch('updatePriceUsd', { assetId, assetNewPrice })
    },
    updateOrPreCachePriceUsd({ state }, { coinId, coinNewPrice }) {
      const isCoinVisibleNow = state.visibleAssetIdsForTable.includes(coinId)

      if (isCoinVisibleNow) {
        // todo: здесь должна вызыватся ф-я
        //  которая условно либо вызовет ф-ю для реального обновления
        //  должна называться updatePriceUsdDebounced
        //  либо закеширует
        Asset.dispatch('updatePriceUsd', {
          assetId: coinId,
          assetNewPrice: coinNewPrice,
        })
      } else {
        state.notYetUpdatedPrices[coinId] = {
          notUpdatedPrice: coinNewPrice,
        }
      }
    },
  },
  getters: {
    getAssetsPagination(state) {
      return Asset.query()
        .whereIdIn(state.assetsPaginationIds)
        .get()
    },
  },

  mutations: {
    addAssetsPaginationIds(state, { newIds }) {
      state.assetsPaginationIds = [...state.assetsPaginationIds, ...newIds]
    },

    updateVolumeChangeCounter(state, { coinId }) {

      // Если обьем продаж не выводится на данном разрешении экрана,
      // то и не показывать операцию вовсе.
      // Вообще нехорошо в vuex делать что-либо касательно view-рендеринга,
      // но учитывая что тяжелый рендеринг, здесь - оптимальное место для этой проверки.
      if (!this._vm.$screen.showInTableColumnVolume24Hr) return

      // если монета не видна сейчас в таблице, то не нужно показывать операцию
      if (!state.visibleAssetIdsForTable.includes(coinId)) return

      // если только уже была операция, то не показывать ещё одну операцию
      if (!vuexModuleHelpers.canUpdateVolumeChangeCounterByInterval(state, coinId)) return

      // показать операцию
      Asset.update({
        where: coinId,
        data(asset) {
          asset.tradesCounter += 1
        },
      })
    },
  },
}
