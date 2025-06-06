&lt;template&gt;
  &lt;div class=&quot;tournament-stats bg-gradient-to-b from-blue-800 to-blue-900 rounded-lg p-6 shadow-lg border border-blue-700/50&quot;&gt;
    &lt;h3 class=&quot;text-lg font-bold text-white mb-6 flex items-center gap-2&quot;&gt;
      &lt;svg class=&quot;h-5 w-5 text-teal-400&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; viewBox=&quot;0 0 24 24&quot;&gt;
        &lt;path strokeLinecap=&quot;round&quot; strokeLinejoin=&quot;round&quot; strokeWidth=&quot;2&quot; d=&quot;M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z&quot; /&gt;
      &lt;/svg&gt;
      Tournament Stats
    &lt;/h3&gt;
    
    &lt;div class=&quot;grid grid-cols-2 gap-4 mb-8&quot;&gt;
      &lt;div class=&quot;stat-card bg-blue-950/50 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-700/30 hover:border-blue-600/50 transition-colors duration-200&quot;&gt;
        &lt;div class=&quot;text-3xl font-bold text-teal-400 mb-1&quot;&gt;{{ totalMatches }}&lt;/div&gt;
        &lt;div class=&quot;text-sm text-blue-300 font-medium&quot;&gt;Total Matches&lt;/div&gt;
      &lt;/div&gt;
      &lt;div class=&quot;stat-card bg-blue-950/50 backdrop-blur-sm rounded-lg p-4 text-center border border-blue-700/30 hover:border-blue-600/50 transition-colors duration-200&quot;&gt;
        &lt;div class=&quot;text-3xl font-bold text-teal-400 mb-1&quot;&gt;{{ uniqueTeams }}&lt;/div&gt;
        &lt;div class=&quot;text-sm text-blue-300 font-medium&quot;&gt;Teams&lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div v-if=&quot;topTeams.length&quot; class=&quot;mb-8&quot;&gt;
      &lt;h4 class=&quot;text-md font-semibold text-white mb-4 flex items-center gap-2&quot;&gt;
        &lt;svg class=&quot;h-5 w-5 text-teal-400&quot; viewBox=&quot;0 0 20 20&quot; fill=&quot;currentColor&quot;&gt;
          &lt;path fillRule=&quot;evenodd&quot; d=&quot;M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z&quot; clipRule=&quot;evenodd&quot; /&gt;
        &lt;/svg&gt;
        Top Teams
      &lt;/h4&gt;
      &lt;div class=&quot;space-y-3&quot;&gt;
        &lt;div 
          v-for=&quot;team in topTeams&quot; 
          :key=&quot;team.id&quot;
          class=&quot;flex items-center justify-between p-3 rounded-lg bg-blue-950/30 border border-blue-800/50 hover:bg-blue-900/30 transition-colors duration-200&quot;
        &gt;
          &lt;div class=&quot;flex items-center space-x-3&quot;&gt;
            &lt;img 
              v-if=&quot;team.logoUrl&quot;
              :src=&quot;team.logoUrl&quot; 
              :alt=&quot;team.name&quot;
              class=&quot;h-8 w-8 rounded-full bg-blue-900 object-cover border border-blue-700/50&quot;
            /&gt;
            &lt;div v-else class=&quot;flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-lg font-bold text-blue-300 border border-blue-700/50&quot;&gt;
              {{ team.name.charAt(0) }}
            &lt;/div&gt;
            &lt;span class=&quot;text-sm font-medium text-blue-100&quot;&gt;{{ team.name }}&lt;/span&gt;
          &lt;/div&gt;
          &lt;span class=&quot;text-sm text-teal-400 font-bold&quot;&gt;{{ team.matches }} matches&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;

    &lt;div v-if=&quot;upcomingMatches.length&quot;&gt;
      &lt;h4 class=&quot;text-md font-semibold text-white mb-4 flex items-center gap-2&quot;&gt;
        &lt;svg class=&quot;h-5 w-5 text-teal-400&quot; viewBox=&quot;0 0 20 20&quot; fill=&quot;currentColor&quot;&gt;
          &lt;path fillRule=&quot;evenodd&quot; d=&quot;M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z&quot; clipRule=&quot;evenodd&quot; /&gt;
        &lt;/svg&gt;
        Upcoming Matches
      &lt;/h4&gt;
      &lt;div class=&quot;space-y-3&quot;&gt;
        &lt;div 
          v-for=&quot;match in upcomingMatches&quot; 
          :key=&quot;match.id&quot;
          class=&quot;p-3 rounded-lg bg-blue-950/30 border border-blue-800/50 hover:bg-blue-900/30 transition-colors duration-200&quot;
        &gt;
          &lt;div class=&quot;flex justify-between items-center mb-2 text-xs&quot;&gt;
            &lt;div class=&quot;text-blue-300&quot;&gt;
              {{ new Date(match.startTimeScheduled).toLocaleDateString() }}
            &lt;/div&gt;
            &lt;div class=&quot;text-teal-400 font-medium&quot;&gt;{{ match.format?.nameShortened }}&lt;/div&gt;
          &lt;/div&gt;
          &lt;div class=&quot;flex justify-between items-center text-sm font-medium&quot;&gt;
            &lt;div class=&quot;text-blue-100&quot;&gt;{{ match.teams[0]?.baseInfo?.name || 'TBD' }}&lt;/div&gt;
            &lt;div class=&quot;text-blue-400 text-xs px-3&quot;&gt;vs&lt;/div&gt;
            &lt;div class=&quot;text-blue-100&quot;&gt;{{ match.teams[1]?.baseInfo?.name || 'TBD' }}&lt;/div&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
export default {
  name: 'TournamentStats',
  
  props: {
    series: {
      type: Array,
      required: true
    }
  },

  computed: {
    totalMatches() {
      return this.series.length
    },

    uniqueTeams() {
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

    topTeams() {
      const teamStats = {}
      this.series.forEach(match =&gt; {
        match.teams.forEach(team =&gt; {
          if (team.baseInfo?.id) {
            if (!teamStats[team.baseInfo.id]) {
              teamStats[team.baseInfo.id] = {
                id: team.baseInfo.id,
                name: team.baseInfo.name,
                logoUrl: team.baseInfo.logoUrl,
                matches: 0
              }
            }
            teamStats[team.baseInfo.id].matches++
          }
        })
      })
      
      return Object.values(teamStats)
        .sort((a, b) =&gt; b.matches - a.matches)
        .slice(0, 5)
    },

    upcomingMatches() {
      const now = new Date()
      return this.series
        .filter(match =&gt; new Date(match.startTimeScheduled) &gt; now)
        .sort((a, b) =&gt; new Date(a.startTimeScheduled) - new Date(b.startTimeScheduled))
        .slice(0, 3)
    }
  }
}
&lt;/script&gt;
