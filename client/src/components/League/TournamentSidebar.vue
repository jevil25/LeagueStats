&lt;template&gt;
  &lt;div class=&quot;space-y-4 w-full&quot;&gt;
    &lt;div class=&quot;bg-blue-800 rounded-lg p-4 shadow-lg&quot;&gt;
      &lt;h3 class=&quot;text-lg font-semibold text-white mb-4&quot;&gt;Recent Tournaments&lt;/h3&gt;
      &lt;div v-if=&quot;tournaments.length&quot; class=&quot;space-y-3&quot;&gt;
        &lt;router-link
          v-for=&quot;tournament in recentTournaments&quot;
          :key=&quot;tournament.id&quot;
          :to=&quot;{ name: 'tournament-details', params: { id: tournament.id }}&quot;
          class=&quot;flex items-center p-2 rounded-md hover:bg-blue-700 transition-colors duration-200&quot;
        &gt;
          &lt;img 
            v-if=&quot;tournament.logoUrl&quot;
            :src=&quot;tournament.logoUrl&quot; 
            :alt=&quot;tournament.name&quot;
            class=&quot;h-8 w-8 rounded-full bg-blue-900 object-cover&quot;
          /&gt;
          &lt;div v-else class=&quot;flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-lg font-bold text-white&quot;&gt;
            {{ tournament.name.charAt(0) }}
          &lt;/div&gt;
          &lt;span class=&quot;ml-3 text-sm text-blue-100 hover:text-teal-400&quot;&gt;{{ tournament.name }}&lt;/span&gt;
        &lt;/router-link&gt;
      &lt;/div&gt;
      &lt;div v-else class=&quot;text-center text-blue-200&quot;&gt;
        No tournaments found
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class=&quot;bg-blue-800 rounded-lg p-4 shadow-lg&quot;&gt;
      &lt;h3 class=&quot;text-lg font-semibold text-white mb-4&quot;&gt;Tournament Stats&lt;/h3&gt;
      &lt;div class=&quot;grid grid-cols-2 gap-4&quot;&gt;
        &lt;div class=&quot;text-center&quot;&gt;
          &lt;div class=&quot;text-2xl font-bold text-teal-400&quot;&gt;{{ tournaments.length }}&lt;/div&gt;
          &lt;div class=&quot;text-sm text-blue-200&quot;&gt;Total Tournaments&lt;/div&gt;
        &lt;/div&gt;
        &lt;div class=&quot;text-center&quot;&gt;
          &lt;div class=&quot;text-2xl font-bold text-teal-400&quot;&gt;{{ upcomingMatchCount }}&lt;/div&gt;
          &lt;div class=&quot;text-sm text-blue-200&quot;&gt;Upcoming Matches&lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
import { mapState } from 'vuex'

export default {
  name: 'TournamentSidebar',

  computed: {
    ...mapState({
      tournaments: state =&gt; state.leagues.tournaments.data,
      series: state =&gt; state.leagues.series.data
    }),
    recentTournaments() {
      return this.tournaments.slice(0, 5)
    },
    upcomingMatchCount() {
      return this.series.filter(match =&gt; new Date(match.startTimeScheduled) &gt; new Date()).length
    }
  }
}
&lt;/script&gt;
