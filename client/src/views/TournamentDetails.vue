<template>
  <div class="tournament-page min-h-screen bg-blue-1000">
    <!-- Tournament Header with Nav -->
    <TournamentHeader 
      :tournament="tournament"
      :series="series"
    />

    <!-- Main Content Area -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="vue-sticky-container relative flex items-start gap-8 overflow-hidden">
        <!-- Stats Sidebar -->
        <VueStickySidebar
          :top-spacing="48"
          :bottom-spacing="123"
          class="sidebar w-3/12 z-40 flex-shrink-0"
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

          <div v-else-if="series.length" class="space-y-4">
            <div 
              v-for="match in series" 
              :key="match.id"
              class="match-card group relative bg-blue-800/20 hover:bg-blue-700/30 transition-all duration-300 rounded-lg border border-blue-700/30 hover:border-teal-400/50 backdrop-blur-sm cursor-pointer overflow-hidden"
              @click="selectSeries(match.id)"
            >
              <!-- Glow effect on hover -->
              <div class="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/5 to-teal-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="p-6 relative">
                <!-- Date and Format -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center gap-4">
                    <div class="text-blue-300 font-medium">
                      {{ new Date(match.startTimeScheduled).toLocaleDateString(undefined, {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      }) }}
                    </div>
                    <div class="text-teal-400 font-medium px-3 py-1 rounded-full bg-teal-400/10 border border-teal-400/20">
                      {{ match.format?.nameShortened || 'Bo1' }}
                    </div>
                    <div class="text-blue-200 font-medium">
                      {{ formatMatchTime(match.startTimeScheduled) }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between gap-8">
                  <!-- Team 1 -->
                  <div class="flex-1 flex items-center justify-end space-x-6">
                    <div class="text-right">
                      <div class="text-xl font-semibold text-white truncate max-w-[200px] group-hover:text-teal-400 transition-colors duration-300">
                        {{ match.teams[0]?.baseInfo?.name || 'TBD' }}
                      </div>
                      <div class="text-sm text-blue-300 mt-1 font-medium">
                        {{ match.teams[0]?.score || '0' }} - {{ match.teams[0]?.gamesWon || '0' }}
                      </div>
                    </div>
                    <div class="flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                      <img
                        v-if="match.teams[0]?.baseInfo?.logoUrl"
                        :src="match.teams[0].baseInfo.logoUrl"
                        :alt="match.teams[0].baseInfo.name"
                        class="h-16 w-16 object-contain"
                      />
                      <div v-else class="h-16 w-16 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 text-2xl font-bold border-2 border-blue-700/50">
                        {{ match.teams[0]?.baseInfo?.name?.[0] || '?' }}
                      </div>
                    </div>
                  </div>

                  <!-- VS -->
                  <div class="flex-shrink-0 px-6">
                    <div class="text-blue-400 font-medium text-lg bg-blue-900/50 px-4 py-2 rounded-full border border-blue-700/50">VS</div>
                  </div>

                  <!-- Team 2 -->
                  <div class="flex-1 flex items-center space-x-6">
                    <div class="flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                      <img
                        v-if="match.teams[1]?.baseInfo?.logoUrl"
                        :src="match.teams[1].baseInfo.logoUrl"
                        :alt="match.teams[1].baseInfo.name"
                        class="h-16 w-16 object-contain"
                      />
                      <div v-else class="h-16 w-16 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-300 text-2xl font-bold border-2 border-blue-700/50">
                        {{ match.teams[1]?.baseInfo?.name?.[0] || '?' }}
                      </div>
                    </div>
                    <div class="text-left">
                      <div class="text-xl font-semibold text-white truncate max-w-[200px] group-hover:text-teal-400 transition-colors duration-300">
                        {{ match.teams[1]?.baseInfo?.name || 'TBD' }}
                      </div>
                      <div class="text-sm text-blue-300 mt-1 font-medium">
                        {{ match.teams[1]?.score || '0' }} - {{ match.teams[1]?.gamesWon || '0' }}
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

      <!-- Series Stats Modal -->
      <div 
        v-if="showSeriesStats" 
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="series-stats-modal"
        role="dialog"
        aria-modal="true"
      >
        <!-- Overlay -->
        <div class="fixed inset-0 bg-blue-900 bg-opacity-75 transition-opacity"></div>

        <!-- Modal Content -->
        <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div 
            class="relative inline-block transform overflow-hidden rounded-lg bg-blue-800/95 p-8 text-left align-bottom shadow-xl backdrop-blur-sm transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:align-middle"
          >
            <!-- Close Button -->
            <button
              @click="closeSeriesStats"
              class="absolute right-4 top-4 rounded-md text-blue-300 hover:text-blue-100"
            >
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Loading State -->
            <div v-if="seriesStateLoading" class="flex flex-col items-center justify-center py-12">
              <div class="w-16 h-16 relative flex items-center justify-center">
                <div class="absolute inset-0 bg-teal-400 opacity-20 blur-lg rounded-full"></div>
                <svg class="animate-spin h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div class="text-lg font-medium text-blue-100 mt-4">Loading series stats...</div>
            </div>

            <!-- Error State -->
            <div v-else-if="seriesStateError" class="text-center py-12">
              <div class="bg-red-500/10 rounded-lg border border-red-500/20 p-6 inline-block">
                <svg class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div class="text-lg font-medium text-red-500">
                  {{ seriesStateError }}
                </div>
              </div>
            </div>

            <!-- Series Stats Content -->
            <div v-else-if="seriesState" class="text-blue-100">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-2xl font-bold text-white mb-2">
                    Series Details
                  </h3>
                  <div class="text-sm text-blue-300">
                    Started: {{ seriesState.startedAt ? new Date(seriesState.startedAt).toLocaleString() : 'Not started' }} 
                    · Updated: {{ new Date(seriesState.updatedAt).toLocaleTimeString() }}
                  </div>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="text-teal-400 font-medium px-3 py-1 rounded bg-teal-400/10 border border-teal-400/20">
                    {{ seriesState.format }}
                  </div>
                  <div :class="[seriesState.finished ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-blue-400 bg-blue-400/10 border-blue-400/20']" 
                    class="font-medium px-3 py-1 rounded border">
                    {{ seriesState.finished ? 'Completed' : 'In Progress' }}
                  </div>
                </div>
              </div>

              <!-- Teams Overview -->
              <div class="grid grid-cols-2 gap-8 mb-8">
                <div v-for="team in seriesState.teams" :key="team.id" 
                  :class="[team.won ? 'border-green-400/30 bg-green-400/5' : 'border-red-400/30 bg-red-400/5']"
                  class="p-6 rounded-lg backdrop-blur-sm relative overflow-hidden"
                >
                  <div class="absolute inset-0 bg-blue-900/50 backdrop-blur-sm"></div>
                  <div class="relative">
                    <div class="flex items-center space-x-4 mb-4">
                      <div class="text-xl font-semibold text-white">{{ team.name }}</div>
                      <div :class="team.won ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'"
                        class="text-sm font-medium px-2 py-0.5 rounded border"
                      >
                        {{ team.won ? 'Winner' : 'Defeated' }}
                      </div>
                    </div>
                    <div class="flex items-center space-x-6">
                      <div>
                        <div class="text-sm text-blue-300">Games Won</div>
                        <div class="text-3xl font-bold text-teal-400">{{ team.score }}</div>
                      </div>
                      <div>
                        <div class="text-sm text-blue-300">Win Rate</div>
                        <div class="text-xl font-semibold" :class="(team.score / seriesState.games.length * 100) >= 50 ? 'text-green-400' : 'text-red-400'">
                          {{ ((team.score / seriesState.games.length) * 100).toFixed(0) }}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Series Analysis -->
              <div class="space-y-6">
                <!-- Tabs -->
                <div class="border-b border-blue-700/30">
                  <div class="flex space-x-1">
                    <button 
                      @click="selectedTab = 'overview'"
                      :class="[
                        selectedTab === 'overview' 
                          ? 'border-teal-400 text-teal-400' 
                          : 'border-transparent text-blue-300 hover:text-blue-100 hover:border-blue-300'
                      ]"
                      class="px-4 py-2 border-b-2 font-medium text-sm transition-colors duration-200"
                    >
                      Series Overview
                    </button>
                    <button 
                      v-for="game in seriesState.games" 
                      :key="game.id"
                      @click="selectedTab = game.id"
                      :class="[
                        selectedTab === game.id 
                          ? 'border-teal-400 text-teal-400' 
                          : 'border-transparent text-blue-300 hover:text-blue-100 hover:border-blue-300'
                      ]"
                      class="px-4 py-2 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center space-x-2"
                    >
                      <span>Game {{ game.sequenceNumber }}</span>
                      <span :class="[
                        game.finished ? 'bg-green-400/10 border-green-400/20 text-green-400' :
                        game.started ? 'bg-blue-400/10 border-blue-400/20 text-blue-400' :
                        'bg-gray-400/10 border-gray-400/20 text-gray-400'
                      ]" class="text-xs px-1.5 py-0.5 rounded border">
                        {{ game.finished ? 'Finished' : game.started ? 'Live' : 'Scheduled' }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Series Overview Tab -->
                <div v-if="selectedTab === 'overview'" class="space-y-8">
                  <div class="grid grid-cols-4 gap-6">
                    <!-- Series Stats Cards -->
                    <div class="bg-blue-900/30 rounded-lg p-4 border border-blue-700/30">
                      <div class="text-sm text-blue-300">Duration</div>
                      <div class="mt-1">
                        <div class="text-xl font-semibold text-white">
                          {{ formatDuration(seriesState.games.reduce((acc, game) => acc + (parseDurationToSeconds(game.duration) || 0), 0)) }}
                        </div>
                        <div class="text-sm text-teal-400">
                          {{ formatDuration(seriesState.games.reduce((acc, game) => acc + (parseDurationToSeconds(game.duration) || 0), 0) / seriesState.games.length) }} avg
                        </div>
                      </div>
                    </div>

                    <div class="bg-blue-900/30 rounded-lg p-4 border border-blue-700/30">
                      <div class="text-sm text-blue-300">Total Kills</div>
                      <div class="mt-1">
                        <div class="text-xl font-semibold text-white">
                          {{ seriesState.games.reduce((acc, game) => acc + game.teams.reduce((teamAcc, team) => teamAcc + team.kills, 0), 0) }}
                        </div>
                        <div class="text-sm text-teal-400">
                          {{ (seriesState.games.reduce((acc, game) => acc + game.teams.reduce((teamAcc, team) => teamAcc + team.kills, 0), 0) / seriesState.games.length).toFixed(1) }} per game
                        </div>
                      </div>
                    </div>

                    <div class="bg-blue-900/30 rounded-lg p-4 border border-blue-700/30">
                      <div class="text-sm text-blue-300">Structures</div>
                      <div class="mt-1">
                        <div class="text-xl font-semibold text-white">
                          {{ seriesState.games.reduce((acc, game) => acc + game.teams.reduce((teamAcc, team) => teamAcc + team.structuresDestroyed, 0), 0) }}
                        </div>
                        <div class="text-sm text-teal-400">
                          {{ (seriesState.games.reduce((acc, game) => acc + game.teams.reduce((teamAcc, team) => teamAcc + team.structuresDestroyed, 0), 0) / seriesState.games.length).toFixed(1) }} per game
                        </div>
                      </div>
                    </div>

                    <div class="bg-blue-900/30 rounded-lg p-4 border border-blue-700/30">
                      <div class="text-sm text-blue-300">First Bloods</div>
                      <div class="mt-1">
                        <div class="text-xl font-semibold text-white">
                          {{ seriesState.games.reduce((acc, game) => acc + game.teams.filter(team => team.firstKill).length, 0) }}
                        </div>
                        <div class="text-sm text-teal-400">
                          {{ ((seriesState.games.reduce((acc, game) => acc + game.teams.filter(team => team.firstKill).length, 0) / seriesState.games.length) * 100).toFixed(0) }}% of games
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Team Overview -->
                  <div class="grid grid-cols-2 gap-8">
                    <div v-for="team in seriesState.teams" :key="team.id" 
                      class="bg-blue-900/30 rounded-lg p-6 border border-blue-700/30"
                    >
                      <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center space-x-3">
                          <h5 class="text-lg font-semibold text-white">{{ team.name }}</h5>
                          <div :class="team.score > seriesState.games.length/2 ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-blue-300 bg-blue-400/10 border-blue-400/20'"
                            class="text-sm font-medium px-2 py-0.5 rounded border"
                          >
                            {{ team.score }} wins
                          </div>
                        </div>
                      </div>

                      <!-- Team Series Stats -->
                      <div class="space-y-4">
                        <!-- Aggregate Stats -->
                        <div class="grid grid-cols-3 gap-4">
                          <div v-for="(stat, label) in getTeamSeriesStats(team.id)" :key="label"
                            class="bg-blue-950/50 rounded p-3"
                          >
                            <div class="text-sm text-blue-300">{{ label }}</div>
                            <div class="text-lg font-semibold" :class="stat.color">{{ stat.value }}</div>
                            <div class="text-sm text-blue-200">{{ stat.subtext }}</div>
                          </div>
                        </div>

                        <!-- Best Players -->
                        <div class="mt-6">
                          <h6 class="text-sm font-medium text-blue-300 mb-3">Top Performers</h6>
                          <div class="space-y-2">
                            <div v-for="performer in getTeamTopPerformers(team.id)" :key="performer.category"
                              class="bg-blue-950/50 rounded p-3 flex items-center justify-between"
                            >
                              <div>
                                <div class="text-sm text-blue-200">{{ performer.category }}</div>
                                <div class="font-medium text-white">{{ performer.player }}</div>
                              </div>
                              <div class="text-lg font-semibold" :class="performer.color">
                                {{ performer.value }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Games List -->
                <div v-for="game in seriesState.games" :key="game.id" class="bg-blue-900/30 rounded-lg border border-blue-700/30">
                  <!-- Game Header -->
                  <div class="p-4 bg-blue-900/50 rounded-t-lg border-b border-blue-700/30">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-4">
                        <div class="text-lg font-semibold text-white">Game {{ game.sequenceNumber }}</div>
                        <div :class="[
                          game.finished ? 'text-green-400 bg-green-400/10 border-green-400/20' : 
                          game.started ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
                          'text-gray-400 bg-gray-400/10 border-gray-400/20'
                        ]" class="text-sm font-medium px-2 py-0.5 rounded border">
                          {{ game.finished ? 'Finished' : game.started ? 'In Progress' : 'Not Started' }}
                        </div>
                      </div>
                      <div class="flex items-center space-x-4">
                        <div class="text-sm">
                          <span class="text-blue-300">{{ game.startedAt ? new Date(game.startedAt).toLocaleString() : 'Not started' }}</span>
                          <span v-if="game.duration" class="ml-2 text-teal-400">
                            · {{ formatDuration(game.duration) }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Quick Stats Bar -->
                    <div class="mt-4 grid grid-cols-2">
                      <div v-for="team in game.teams" :key="team.id" 
                        :class="[team.side === 'blue' ? 'text-right pr-2' : 'text-left pl-2']"
                      >
                        <div class="inline-flex items-center" :class="[team.side === 'blue' ? 'flex-row-reverse space-x-reverse' : 'flex-row']">
                          <span class="font-medium text-white">{{ team.name }}</span>
                          <span :class="[team.won ? 'text-green-400' : 'text-red-400']" class="text-sm mx-2">({{ team.score }})</span>
                          <div class="px-2 py-0.5 bg-blue-950/50 rounded text-sm space-x-2">
                            <span class="text-green-400">{{ team.kills }}</span>
                            <span class="text-red-400">{{ team.deaths }}</span>
                            <span class="text-blue-300">{{ team.killAssistsGiven }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Game Content -->
                  <div v-if="selectedTab === game.id" class="p-6 space-y-8">
                    <!-- Team Stats -->
                    <div class="grid grid-cols-2 gap-8">
                      <div v-for="team in game.teams" :key="team.id" 
                        :class="[team.won ? 'border-green-400/30' : 'border-red-400/30']"
                        class="bg-blue-950/50 rounded-lg p-6 border relative overflow-hidden"
                      >
                        <!-- Team Header -->
                        <div class="flex items-center justify-between mb-6">
                          <div class="flex items-center space-x-3">
                            <h5 class="text-lg font-semibold text-white">{{ team.name }}</h5>
                            <div :class="[team.won ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20']"
                              class="text-sm font-medium px-2 py-0.5 rounded border"
                            >
                              {{ team.won ? 'Victory' : 'Defeat' }}
                            </div>
                          </div>
                          <div class="text-sm text-blue-300">Side: {{ team.side === 'blue' ? 'Blue' : 'Red' }}</div>
                        </div>

                        <!-- Team Performance Grid -->
                        <div class="grid grid-cols-4 gap-4 mb-6">
                          <div class="bg-blue-900/30 rounded-lg p-3">
                            <div class="text-sm text-blue-300">Combat Score</div>
                            <div class="text-xl font-semibold text-white">
                              {{ team.kills }}/{{ team.deaths }}/{{ team.killAssistsGiven }}
                            </div>
                            <div class="text-sm text-teal-400">
                              {{ ((team.kills + team.killAssistsGiven) / Math.max(team.deaths, 1)).toFixed(2) }} KDA
                            </div>
                          </div>
                          <div class="bg-blue-900/30 rounded-lg p-3">
                            <div class="text-sm text-blue-300">Objectives</div>
                            <div class="text-xl font-semibold text-yellow-400">{{ team.structuresDestroyed }}</div>
                            <div class="text-sm text-blue-200">Structures</div>
                          </div>
                          <div class="bg-blue-900/30 rounded-lg p-3">
                            <div class="text-sm text-blue-300">Kill Stats</div>
                            <div class="text-sm space-y-1">
                              <div class="flex justify-between">
                                <span class="text-blue-200">First Blood</span>
                                <span :class="team.firstKill ? 'text-green-400' : 'text-gray-400'">
                                  {{ team.firstKill ? 'Yes' : 'No' }}
                                </span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-blue-200">Team Kills</span>
                                <span class="text-teal-400">{{ team.kills }}</span>
                              </div>
                            </div>
                          </div>
                          <div class="bg-blue-900/30 rounded-lg p-3">
                            <div class="text-sm text-blue-300">Avg per Player</div>
                            <div class="text-sm space-y-1">
                              <div class="flex justify-between">
                                <span class="text-blue-200">Kills</span>
                                <span class="text-green-400">{{ (team.kills / team.players.length).toFixed(1) }}</span>
                              </div>
                              <div class="flex justify-between">
                                <span class="text-blue-200">Deaths</span>
                                <span class="text-red-400">{{ (team.deaths / team.players.length).toFixed(1) }}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Player Performance Table -->
                        <div class="bg-blue-900/30 rounded-lg overflow-hidden">
                          <div class="px-4 py-2 bg-blue-900/50 text-sm font-medium grid" 
                            style="grid-template-columns: 2fr repeat(8, 1fr);"
                          >
                            <div class="text-blue-300">Player</div>
                            <div class="text-center text-green-400" title="Kills">K</div>
                            <div class="text-center text-red-400" title="Deaths">D</div>
                            <div class="text-center text-blue-300" title="Assists">A</div>
                            <div class="text-center text-teal-400" title="Kill/Death Ratio">KD</div>
                            <div class="text-center text-blue-300" title="Kill Participation">KP</div>
                            <div class="text-center text-yellow-400" title="Assists Received">AR</div>
                            <div class="text-center text-purple-400" title="Assists Given">AG</div>
                            <div class="text-center text-blue-300" title="Status">Status</div>
                          </div>
                          
                          <div class="divide-y divide-blue-800/30">
                            <div v-for="player in team.players" :key="player.id"
                              class="px-4 py-3 grid items-center hover:bg-blue-900/20 transition-colors duration-200"
                              style="grid-template-columns: 2fr repeat(8, 1fr);"
                            >
                              <div class="font-medium text-white">{{ player.name }}</div>
                              <div class="text-center text-green-400">{{ player.kills }}</div>
                              <div class="text-center text-red-400">{{ player.deaths }}</div>
                              <div class="text-center text-blue-300">{{ player.killAssistsGiven }}</div>
                              <div class="text-center" :class="(player.kills / Math.max(player.deaths, 1)) >= 3 ? 'text-yellow-400' : (player.kills / Math.max(player.deaths, 1)) >= 1 ? 'text-green-400' : 'text-red-400'">
                                {{ (player.kills / Math.max(player.deaths, 1)).toFixed(1) }}
                              </div>
                              <div class="text-center text-teal-400">
                                {{ (((player.kills + player.killAssistsGiven) / Math.max(team.kills, 1)) * 100).toFixed(0) }}%
                              </div>
                              <div class="text-center text-yellow-400">{{ player.killAssistsReceived }}</div>
                              <div class="text-center text-purple-400">{{ player.killAssistsGiven }}</div>
                              <div class="text-center">
                                <span :class="[
                                  player.participationStatus === 'active' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                                  player.participationStatus === 'inactive' ? 'text-red-400 bg-red-400/10 border-red-400/20' :
                                  'text-blue-400 bg-blue-400/10 border-blue-400/20'
                                ]" class="text-xs px-2 py-0.5 rounded-full border">
                                  {{ player.participationStatus }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
      tournament: null,
      selectedSeriesId: null,
      showSeriesStats: false,
      selectedTab: 'overview'
    }
  },

  mounted() {
    console.log('TournamentDetails mounted', {
      series: this.series,
      tournament: this.tournament
    })
  },

  watch: {
    series: {
      immediate: true,
      handler(newSeries) {
        console.log('Series data changed:', { 
          length: newSeries?.length || 0,
          firstMatch: newSeries?.[0]
        })
      }
    }
  },

  computed: {
    ...mapState({
      series: state => state.leagues.series.data,
      seriesLoading: state => state.leagues.series.loading,
      seriesError: state => state.leagues.series.error,
      tournaments: state => state.leagues.tournaments.data,
      seriesState: state => state.leagues.seriesState.data,
      seriesStateLoading: state => state.leagues.seriesState.loading,
      seriesStateError: state => state.leagues.seriesState.error
    }),
    selectedGame() {
      if (this.selectedTab === 'overview') return null
      return this.seriesState.games.find(game => game.id === this.selectedTab)
    }
  },

  methods: {
    formatMatchTime(dateString) {
      const date = new Date(dateString)
      return date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    
    formatDuration(duration) {
      if (!duration) return '0:00'
      
      // Check if duration is ISO 8601 format
      if (typeof duration === 'string' && duration.startsWith('PT')) {
        const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?/)
        if (!matches) return '0:00'
        
        const [, hours, minutes, seconds] = matches
        const totalMinutes = (parseInt(hours || 0) * 60) + parseInt(minutes || 0)
        const secs = Math.floor(parseFloat(seconds || 0))
        return `${totalMinutes}:${secs.toString().padStart(2, '0')}`
      }
      
      // Handle numeric duration in seconds
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    },

    parseDurationToSeconds(duration) {
      if (!duration) return 0
      if (typeof duration === 'number') return duration

      // Parse ISO 8601 duration
      const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:([\d.]+)S)?/)
      if (!matches) return 0
      
      const [, hours, minutes, seconds] = matches
      return (parseInt(hours || 0) * 3600) + 
             (parseInt(minutes || 0) * 60) + 
             Math.floor(parseFloat(seconds || 0))
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

    async selectSeries(seriesId) {
      this.selectedSeriesId = seriesId
      this.showSeriesStats = true
      try {
        await this.getSeriesState({ 
          seriesId,
          gameFinished: true
        })
      } catch (error) {
        console.error('Error loading series state:', error)
      }
    },

    closeSeriesStats() {
      this.showSeriesStats = false
      this.selectedSeriesId = null
    },
    
    getTeamSeriesStats(teamId) {
      const games = this.seriesState.games
      const teamGames = games.map(game => game.teams.find(t => t.id === teamId)).filter(Boolean)
      
      const totalKills = teamGames.reduce((acc, team) => acc + team.kills, 0)
      const totalDeaths = teamGames.reduce((acc, team) => acc + team.deaths, 0)
      const totalAssists = teamGames.reduce((acc, team) => acc + team.killAssistsGiven, 0)
      const totalStructures = teamGames.reduce((acc, team) => acc + team.structuresDestroyed, 0)
      const gamesWithFirstBlood = teamGames.filter(team => team.firstKill).length
      
      return {
        'KDA': {
          value: `${totalKills}/${totalDeaths}/${totalAssists}`,
          color: 'text-white',
          subtext: `${((totalKills + totalAssists) / Math.max(totalDeaths, 1)).toFixed(2)} ratio`
        },
        'Avg. Kills': {
          value: (totalKills / games.length).toFixed(1),
          color: 'text-green-400',
          subtext: 'per game'
        },
        'First Blood': {
          value: `${((gamesWithFirstBlood / games.length) * 100).toFixed(0)}%`,
          color: totalKills > totalDeaths ? 'text-green-400' : 'text-red-400',
          subtext: `${gamesWithFirstBlood} games`
        },
        'Structures': {
          value: totalStructures,
          color: 'text-yellow-400',
          subtext: `${(totalStructures / games.length).toFixed(1)} per game`
        }
      }
    },

    getTeamTopPerformers(teamId) {
      const games = this.seriesState.games
      const players = {}
      
      // Aggregate player stats across all games
      games.forEach(game => {
        const team = game.teams.find(t => t.id === teamId)
        if (!team) return

        team.players.forEach(player => {
          if (!players[player.id]) {
            players[player.id] = {
              name: player.name,
              kills: 0,
              deaths: 0,
              assists: 0,
              killParticipation: 0,
              gamesPlayed: 0
            }
          }
          
          players[player.id].kills += player.kills
          players[player.id].deaths += player.deaths
          players[player.id].assists += player.killAssistsGiven
          players[player.id].gamesPlayed++
        })
      })

      // Calculate top performers in different categories
      const performers = []
      let mostKills = { value: 0 }
      let bestKDA = { value: 0 }
      let mostAssists = { value: 0 }

      Object.entries(players).forEach(([id, stats]) => {
        const kda = (stats.kills + stats.assists) / Math.max(stats.deaths, 1)
        if (stats.kills > mostKills.value) {
          mostKills = { player: stats.name, value: stats.kills, category: 'Most Kills', color: 'text-green-400' }
        }
        if (kda > bestKDA.value) {
          bestKDA = { player: stats.name, value: kda.toFixed(2), category: 'Best KDA', color: 'text-teal-400' }
        }
        if (stats.assists > mostAssists.value) {
          mostAssists = { player: stats.name, value: stats.assists, category: 'Most Assists', color: 'text-blue-400' }
        }
      })

      return [mostKills, bestKDA, mostAssists]
    },

    ...mapActions('leagues', ['seriesRequest', 'getSeriesState'])
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  isolation: isolate;
}

.match-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
