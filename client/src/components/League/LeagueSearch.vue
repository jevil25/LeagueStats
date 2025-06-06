<template>
  <div class="min-h-screen p-8 bg-gradient">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-white mb-4">League Tournaments</h1>
        <p class="text-xl text-blue-100">
          Search for professional League of Legends tournaments across the globe. Get details about upcoming and past events.
        </p>
      </div>

      <div class="max-w-3xl mx-auto mb-12">
        <form @submit.prevent="searchTournaments" class="w-full flex gap-x-4">
          <label for="tournament-search" class="sr-only">Search tournaments</label>
          <input
            v-model="searchQuery"
            id="tournament-search"
            name="tournament"
            type="text"
            required
            class="flex-1 h-12 px-4 rounded-lg bg-blue-900/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Enter tournament name"
          />
          <button
            type="submit"
            :disabled="tournamentsLoading"
            class="h-12 px-8 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </form>
      </div>

      <div v-if="tournamentsLoading" class="text-center py-12">
        <div class="text-2xl text-blue-200">Loading tournaments...⌛</div>
      </div>

      <div v-else-if="tournamentsError" class="text-center py-12">
        <div class="text-2xl text-blue-200">{{ tournamentsError }} 😕</div>
      </div>

      <div v-else-if="tournaments.length" class="grid grid-cols-2 gap-4">
        <router-link
          v-for="tournament in tournaments"
          :key="tournament.id"
          :to="{ name: 'tournament-details', params: { id: tournament.id }}"
          class="block bg-blue-800/50 hover:bg-blue-700 rounded-lg p-4 group transition-colors duration-200"
          >
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <img 
                  v-if="tournament.logoUrl"
                  :src="tournament.logoUrl" 
                  :alt="tournament.name"
                  class="h-12 w-12 rounded-full bg-blue-900 object-cover"
                />
                <div v-else class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-900 text-2xl font-bold text-white">
                  {{ tournament.name.charAt(0) }}
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-semibold text-white truncate group-hover:text-teal-400">
                  {{ tournament.name }}
                </h3>
              </div>
            </div>
          </router-link>
        </div>

        <div v-else-if="searchPerformed" class="text-center py-12">
          <div class="text-2xl text-blue-200">No tournaments found 😕</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import VueStickySidebar from 'vue-sticky-sidebar'
import TournamentSidebar from './TournamentSidebar.vue'

export default {
  name: 'LeagueSearch',

  components: {
    VueStickySidebar,
    TournamentSidebar
  },

  data() {
    return {
      searchQuery: '',
      searchPerformed: false
    }
  },

  computed: {
    ...mapState({
      tournaments: state => state.leagues.tournaments.data,
      tournamentsLoading: state => state.leagues.tournaments.loading,
      tournamentsError: state => state.leagues.tournaments.error
    })
  },

  methods: {
    async searchTournaments() {
      try {
        this.searchPerformed = true
        await this.tournamentsRequest({ name: this.searchQuery })
      } catch (error) {
        console.error('Error searching tournaments:', error)
      }
    },
    ...mapActions('leagues', ['tournamentsRequest'])
  },

  created() {
    // Load initial tournaments list on component creation
    this.searchTournaments()
  }
}
</script>

<style scoped>
.tournament-card {
  backdrop-filter: blur(10px);
}

.tournament-card:hover {
  transform: translateY(-2px);
}

.tournament-results {
  min-height: 300px;
}
</style>
