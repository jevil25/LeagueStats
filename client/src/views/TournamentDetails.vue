<template>
  <div class="tournament-page min-h-screen bg-blue-1000">
    <!-- Tournament Header with Nav -->
    <TournamentHeader 
      :tournament="tournament"
      :series="series"
    />

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="vue-sticky-container relative flex items-start justify-between gap-8">
        <!-- Stats Sidebar -->
        <VueStickySidebar
          :top-spacing="48"
          :bottom-spacing="123"
          class="sidebar w-3/12 z-40"
          container-selector=".vue-sticky-container"
        >
          <TournamentStats :series="series" />
        </VueStickySidebar>

        <!-- Matches List -->
        <div class="w-9/12">
          <div v-if="seriesLoading" class="bg-blue-800/50 backdrop-blur-sm rounded-lg p-8 text-center">
            <div class="flex flex-col items-center justify-center">
              <svg class="animate-spin h-8 w-8 text-teal-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <div class="text-lg font-medium text-blue-100">Loading matches...</div>
            </div>
          </div>

          <div v-else-if="seriesError" class="bg-blue-800/50 backdrop-blur-sm rounded-lg p-8 text-center">
            <div class="text-lg font-medium text-blue-100">
              <div>{{ seriesError }}</div>
              <div class="mt-2 text-2xl">😕</div>
            </div>
          </div>

          <div v-else-if="series.length" class="space-y-3">
            <div 
              v-for="match in series" 
              :key="match.id"
              class="match-card relative bg-blue-800/30 hover:bg-blue-700/40 transition-all duration-200 rounded-lg border border-blue-700/30 hover:border-blue-600/50 backdrop-blur-sm"
            >
              <div class="p-4">
                <!-- Date and Format -->
                <div class="flex items-center justify-between mb-4 text-sm">
                  <div class="flex items-center gap-3">
                    <div class="text-blue-300 font-medium">
                      {{ new Date(match.startTimeScheduled).toLocaleDateString(undefined, {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      }) }}
                    </div>
                    <div class="text-teal-400 font-medium px-2 py-0.5 rounded bg-teal-400/10 border border-teal-400/20">
                      {{ match.format?.nameShortened || 'Bo1' }}
                    </div>
                  </div>
                  <div class="text-blue-200">
                    {{ formatMatchTime(match.startTimeScheduled) }}
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <!-- Team 1 -->
                  <div class="flex-1">
                    <div class="flex items-center justify-end space-x-4">
                      <div class="text-right">
                        <div class="text-lg font-medium text-white truncate max-w-[200px]">
                          {{ match.teams[0]?.baseInfo?.name || 'TBD' }}
                        </div>
                        <div class="text-sm text-blue-300 mt-1">0-0</div>
                      </div>
                      <div class="flex-shrink-0">
                        <img
                          v-if="match.teams[0]?.baseInfo?.logoUrl"
                          :src="match.teams[0].baseInfo.logoUrl"
                          :alt="match.teams[0].baseInfo.name"
                          class="h-12 w-12 object-contain"
                        />
                        <div v-else class="h-12 w-12 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 text-xl font-medium">
                          ?
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- VS -->
                  <div class="flex-shrink-0 px-8">
                    <div class="text-blue-400 font-medium text-xl">VS</div>
                  </div>

                  <!-- Team 2 -->
                  <div class="flex-1">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img
                          v-if="match.teams[1]?.baseInfo?.logoUrl"
                          :src="match.teams[1].baseInfo.logoUrl"
                          :alt="match.teams[1].baseInfo.name"
                          class="h-12 w-12 object-contain"
                        />
                        <div v-else class="h-12 w-12 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 text-xl font-medium">
                          ?
                        </div>
                      </div>
                      <div class="text-left">
                        <div class="text-lg font-medium text-white truncate max-w-[200px]">
                          {{ match.teams[1]?.baseInfo?.name || 'TBD' }}
                        </div>
                        <div class="text-sm text-blue-300 mt-1">0-0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="bg-blue-800/50 backdrop-blur-sm rounded-lg p-8 text-center">
            <div class="text-lg font-medium text-blue-100">
              <div>No matches found for this tournament.</div>
              <div class="mt-2 text-2xl">😕</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import VueStickySidebar from 'vue-sticky-sidebar'
import TournamentHeader from '@/components/Tournament/TournamentHeader.vue'
import TournamentStats from '@/components/Tournament/TournamentStats.vue'

export default {
  name: 'TournamentDetails',

  components: {
    VueStickySidebar,
    TournamentHeader,
    TournamentStats
  },

  data() {
    return {
      tournament: null
    }
  },

  computed: {
    ...mapState({
      series: state => state.leagues.series.data,
      seriesLoading: state => state.leagues.series.loading,
      seriesError: state => state.leagues.series.error,
      tournaments: state => state.leagues.tournaments.data
    })
  },

  methods: {
    formatMatchTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    async loadSeriesData() {
      try {
        await this.seriesRequest({
          tournamentIds: [this.$route.params.id],
          tournamentIncludeChildren: true
        })
      } catch (error) {
        console.error('Error loading series:', error)
      }
    },
    ...mapActions('leagues', ['seriesRequest'])
  },

  created() {
    // Find the tournament from the store using the route param
    this.tournament = this.tournaments.find(t => t.id === this.$route.params.id)
    
    // Load series data
    this.loadSeriesData()
  },

  metaInfo() {
    return {
      title: this.tournament ? this.tournament.name : 'Tournament Details'
    }
  }
}
</script>

<style scoped>
.match-card {
  transition: all 0.2s ease;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
