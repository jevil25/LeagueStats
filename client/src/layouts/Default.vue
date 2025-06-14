<template>
  <div class="flex min-h-screen flex-col overflow-hidden bg-blue-900">
    <LazyBackground
      image-source="/img/bg-homepage-1.jpg"
      image-class="absolute z-0 w-full h-[50rem]"
      more-backgrounds="linear-gradient(180deg, rgba(42, 67, 101, 0) 0%, #2A4365 50%),"
      transition-name="fade"
    ></LazyBackground>

    <header
      :class="bgHeader ? 'header-scrolled' : 'bg-transparent'"
      class="header fixed left-0 right-0 z-20 border-b-2 px-4 text-teal-100 transition-colors duration-100 ease-in-out"
      style="border-color: rgba(144, 205, 244, 0.4)"
    >
      <div class="-mb-0.5 flex items-center justify-between py-2">
        <div class="flex flex-1">
          <router-link to="/">
            <img class="block h-10" src="/img/Logo.svg" alt="LeagueStats logo" />
          </router-link>
        </div>

        <SearchForm @formSubmit="redirect" :homepage="false" />

        <div class="flex-1">
          <div class="flex items-center justify-end">  
            <router-link
              to="/"
              :class="{ 'text-white': $route.name === 'home' }"
              class="px-4 py-2 text-blue-200 hover:text-white"
            >
              Tournaments
            </router-link>
            <router-link
              to="/summoner"
              :class="{ 'text-white': $route.name === 'summoner-search' }"
              class="px-4 py-2 text-blue-200 hover:text-white"
            >
              Summoner Search
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <div class="page-wrapper relative z-10 mx-auto mt-20 flex-grow text-white">
      <template v-if="summonerLoading || summonerFound">
        <template v-if="summonerLoading">
          <HeaderLoader />
        </template>
        <template v-else-if="summonerFound">
          <div class="flex items-center justify-between">
            <div>
              <div class="mt-2 flex items-center">
                <Tooltip>
                  <template #trigger>
                    <h1 class="text-4xl font-extrabold">
                      {{ basic.account.name + '#' + basic.account.tagLine }}
                    </h1>
                  </template>
                  <template #default>
                    <div
                      v-if="basic.account.names.length > 1"
                      class="select-none px-2 text-center text-sm text-white"
                    >
                      <div>Old summoner names</div>
                      <ul class="list-inside list-disc pl-2 text-left">
                        <li
                          v-for="name in basic.account.names.slice(0, -1)"
                          :key="name.date"
                          class="text-teal-400"
                        >
                          {{ name.name }}
                        </li>
                      </ul>
                    </div>
                  </template>
                </Tooltip>
                <div
                  v-if="playing"
                  class="ml-4 mt-2 flex items-center rounded-full border border-teal-400 bg-teal-800 px-3 py-1"
                >
                  <div class="playing-dot h-2 w-2 rounded-full bg-teal-flashy"></div>
                  <span class="ml-2 text-sm font-semibold text-teal-flashy">In Game</span>
                </div>
                <div
                  v-if="false"
                  class="ml-4 mt-2 inline-flex items-center rounded border border-teal-500 px-2 py-1 leading-tight"
                  style="background: rgba(40, 94, 97, 0.35)"
                >
                  <svg class="h-4 w-4 text-teal-600">
                    <use xlink:href="#star" />
                  </svg>
                  <div class="ml-1 text-xs font-bold text-teal-200">Favorite</div>
                </div>
              </div>
              <div class="mt-2 flex">
                <div :class="{ playing: playing }" class="relative h-24 w-24">
                  <div
                    :class="{ 'border-2': !playing }"
                    class="relative z-10 h-24 w-24 rounded-full border-teal-400 bg-blue-1000 bg-cover bg-center"
                    :style="{
                      backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${basic.account.profileIconId}.jpg')`,
                    }"
                  >
                    <div
                      class="absolute bottom-0 left-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-teal-400 bg-blue-900 text-xs font-extrabold text-teal-500"
                    >
                      {{ basic.account.summonerLevel }}
                    </div>
                  </div>
                </div>

                <SummonerRanked
                  v-if="Object.entries(basic.ranked).length !== 0"
                  :ranked="basic.ranked"
                />
              </div>
            </div>

            <div>
              <RecentActivity />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <!-- NAVIGATION -->
            <div class="pb-2">
              <router-link
                :to="{
                  name: 'summoner',
                  params: { region: $route.params.region, name: $route.params.name },
                }"
                :class="isRouteActive('summoner')"
                class="cursor-pointer border-b-2 border-transparent pb-2 text-blue-300 hover:text-blue-100"
                exact
                >Overview</router-link
              >
              <router-link
                :to="{
                  name: 'summonerChampions',
                  params: { region: $route.params.region, name: $route.params.name },
                }"
                :class="isRouteActive('summonerChampions')"
                class="ml-4 cursor-pointer border-b-2 border-transparent pb-2 text-blue-300 hover:text-blue-100"
                exact
                >Champions</router-link
              >
              <router-link
                :to="{
                  name: 'summonerRecords',
                  params: { region: $route.params.region, name: $route.params.name },
                }"
                :class="isRouteActive('summonerRecords')"
                class="ml-4 cursor-pointer border-b-2 border-transparent pb-2 text-blue-300 hover:text-blue-100"
                exact
                >Records</router-link
              >
              <router-link
                :to="{
                  name: 'summonerLive',
                  params: { region: $route.params.region, name: $route.params.name },
                }"
                :class="isRouteActive('summonerLive')"
                class="ml-4 cursor-pointer border-b-2 border-transparent pb-2 text-blue-300 hover:text-blue-100"
                exact
                >Live game</router-link
              >
            </div>

            <!-- Select Season -->
            <template v-if="$route.meta.season">
              <FilterSeason />
            </template>
          </div>
        </template>

        <!-- View -->
        <transition :name="tabTransition">
          <slot></slot>
        </transition>
      </template>

      <template v-else-if="summonerNotFound">
        <div class="mt-16 flex justify-center">
          <div class="bg-gradient rounded-lg px-4 py-3 text-center text-lg font-bold text-blue-100">
            <div>Player can't be found.</div>
            <div>😕</div>
          </div>
        </div>
      </template>
    </div>

    <MainFooter />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import FilterSeason from '@/components/Summoner/FilterSeason.vue'
import LazyBackground from '@/components/Common/LazyBackgroundImage.vue'
import MainFooter from '@/components/Layout/MainFooter.vue'
import RecentActivity from '@/components/Summoner/RecentActivity.vue'
import SearchForm from '@/components/Form/SearchForm.vue'
import HeaderLoader from '@/components/Summoner/HeaderLoader.vue'
import SummonerRanked from '@/components/Summoner/SummonerRanked.vue'
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    FilterSeason,
    LazyBackground,
    MainFooter,
    RecentActivity,
    SearchForm,
    HeaderLoader,
    SummonerRanked,
    Tooltip,
  },

  data() {
    return {
      bgHeader: false,
    }
  },

  computed: {
    tabTransition() {
      return this.summonerFound && this.overviewLoaded ? 'tab' : 'none'
    },
    ...mapState({
      basic: (state) => state.summoner.basic,
    }),
    ...mapGetters('summoner', [
      'playing',
      'overviewLoaded',
      'summonerFound',
      'summonerNotFound',
      'summonerLoading',
    ]),
  },

  watch: {
    $route(to, from) {
      if (from.params.region === to.params.region && from.params.name === to.params.name) return
      this.apiCall()
    },
  },

  created() {
    if (this.$route.params.region) {
      this.apiCall()
    }
    window.addEventListener('scroll', this.handleScroll)
  },

  destroyed() {
    window.removeEventListener('scroll', this.handleScroll)
  },

  methods: {
    apiCall() {
      this.updateSettings({ name: 'region', value: this.$route.params.region.toLowerCase() })
      this.basicRequest({ summoner: this.$route.params.name, region: this.$route.params.region })
    },
    handleScroll() {
      this.bgHeader = window.scrollY > 25
    },
    isRouteActive(currentRoute) {
      return {
        'router-link-active': this.$route.name === currentRoute,
      }
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`).catch(() => {})
    },
    ...mapActions('settings', ['updateSettings']),
    ...mapActions('summoner', ['basicRequest']),
  },

  metaInfo() {
    return {
      titleTemplate: this.summonerFound
        ? `${this.basic.account.name} | LeagueStats.gg %s`
        : 'LeagueStats.gg %s',
    }
  },
}
</script>

<style scoped>
.header-scrolled {
  background-color: rgba(42, 67, 101, 0.95);
}

.discord svg {
  width: 22px;
  height: 22px;
  transform-origin: bottom left;
  transition: 0.2s ease-in-out;
}

.discord:hover svg {
  width: 24px;
  height: 24px;
  transform: rotate(-5deg);
}

.discord:hover span {
  color: #ebf8ff;
}

.router-link-active {
  color: #fff;
  border-color: #fff;
}
.playing::before {
  z-index: 0;
  background: rgba(137, 160, 181, 0.2);
}

.playing::before,
.playing::after {
  content: '';
  position: absolute;
  height: 100px;
  width: 100px;
  top: -2px;
  left: -2px;
  right: 0;
  bottom: 0;
  border-radius: 50%;
}

.playing::after {
  z-index: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0) 30%, rgb(36, 232, 204) 100%);
  animation: 0.75s linear 0s infinite normal none running rotate;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.playing-dot {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: 2.5s ease-in-out 0s infinite normal none running pulse;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(36, 232, 204, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
