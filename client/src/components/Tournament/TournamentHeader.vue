&lt;template&gt;
  &lt;div class=&quot;tournament-header relative overflow-hidden py-8 px-6 bg-gradient-to-br from-blue-900 to-blue-800&quot;&gt;
    &lt;div class=&quot;flex items-center gap-8&quot;&gt;
      &lt;div class=&quot;tournament-icon relative&quot;&gt;
        &lt;div class=&quot;absolute inset-0 bg-teal-400 opacity-20 blur-lg rounded-full&quot;&gt;&lt;/div&gt;
        &lt;img 
          v-if=&quot;tournament?.logoUrl&quot;
          :src=&quot;tournament.logoUrl&quot; 
          :alt=&quot;tournament.name&quot;
          class=&quot;relative h-28 w-28 rounded-full bg-blue-900 object-cover border-4 border-blue-400 shadow-lg&quot;
        /&gt;
        &lt;div v-else class=&quot;relative flex h-28 w-28 items-center justify-center rounded-full bg-blue-800 text-5xl font-bold text-white border-4 border-blue-400 shadow-lg&quot;&gt;
          {{ tournament?.name?.charAt(0) || '?' }}
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div class=&quot;tournament-info text-left&quot;&gt;
        &lt;h1 class=&quot;text-5xl font-bold text-white mb-3 tracking-tight&quot;&gt;{{ tournament?.name }}&lt;/h1&gt;
        &lt;div class=&quot;flex items-center gap-6&quot;&gt;
          &lt;div class=&quot;stats-card bg-blue-800/50 px-4 py-2 rounded-lg backdrop-blur-sm&quot;&gt;
            &lt;div class=&quot;flex items-center gap-2&quot;&gt;
              &lt;svg class=&quot;h-5 w-5 text-blue-300&quot; viewBox=&quot;0 0 20 20&quot; fill=&quot;currentColor&quot;&gt;
                &lt;path d=&quot;M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z&quot;/&gt;
              &lt;/svg&gt;
              &lt;span class=&quot;text-blue-300 font-medium&quot;&gt;Teams:&lt;/span&gt;
              &lt;span class=&quot;text-teal-400 font-bold&quot;&gt;{{ uniqueTeamCount }}&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
          &lt;div class=&quot;stats-card bg-blue-800/50 px-4 py-2 rounded-lg backdrop-blur-sm&quot;&gt;
            &lt;div class=&quot;flex items-center gap-2&quot;&gt;
              &lt;svg class=&quot;h-5 w-5 text-blue-300&quot; viewBox=&quot;0 0 20 20&quot; fill=&quot;currentColor&quot;&gt;
                &lt;path d=&quot;M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z&quot;/&gt;
              &lt;/svg&gt;
              &lt;span class=&quot;text-blue-300 font-medium&quot;&gt;Matches:&lt;/span&gt;
              &lt;span class=&quot;text-teal-400 font-bold&quot;&gt;{{ matchCount }}&lt;/span&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div class=&quot;tournament-nav mt-10&quot;&gt;
      &lt;nav class=&quot;flex space-x-6&quot;&gt;
        &lt;router-link 
          v-for=&quot;(route, index) in navRoutes&quot;
          :key=&quot;index&quot;
          :to=&quot;{ name: route.name, params: { id: tournament?.id } }&quot;
          class=&quot;px-6 py-2 text-blue-200 hover:text-white border-b-2 transition-all duration-200&quot;
          :class=&quot;{ 'border-teal-400 text-white font-medium': currentRoute === route.name, 'border-transparent': currentRoute !== route.name }&quot;
        &gt;
          {{ route.label }}
        &lt;/router-link&gt;
      &lt;/nav&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  name: 'TournamentHeader',
  
  props: {
    tournament: {
      type: Object,
      required: true
    },
    series: {
      type: Array,
      default: () =&gt; []
    }
  },

  computed: {
    currentRoute() {
      return this.$route.name
    },
    matchCount() {
      return this.series.length
    },
    uniqueTeamCount() {
      const teams = new Set()
      this.series.forEach(match =&gt; {
        match.teams.forEach(team =&gt; {
          if (team.baseInfo?.id) {
            teams.add(team.baseInfo.id)
          }
        })
      })
      return teams.size
    },
    navRoutes() {
      return [
        { name: 'tournament-details', label: 'Overview' },
        { name: 'tournament-matches', label: 'Matches' },
        { name: 'tournament-teams', label: 'Teams' },
      ]
    }
  }
}
&lt;/script&gt;

&lt;style scoped&gt;
.tournament-header {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.tournament-icon {
  transition: transform 0.2s ease;
}

.tournament-icon:hover {
  transform: scale(1.05);
}
&lt;/style&gt;
