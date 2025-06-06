import { axios } from '@/plugins/axios'

export const namespaced = true

export const state = {
  tournaments: {
    data: [],
    loading: false,
    error: null
  },
  series: {
    data: [],
    loading: false,
    error: null,
    currentTournamentId: null
  },
  seriesState: {
    data: null,
    loading: false,
    error: null,
    currentSeriesId: null
  }
}

export const mutations = {
  TOURNAMENTS_REQUEST(state) {
    state.tournaments.loading = true
    state.tournaments.error = null
  },
  TOURNAMENTS_SUCCESS(state, data) {
    state.tournaments.data = data.data.tournaments.edges.map(edge => ({
      ...edge.node
    }))
    state.tournaments.loading = false
  },
  TOURNAMENTS_ERROR(state, error) {
    state.tournaments.error = error
    state.tournaments.loading = false
  },
  SERIES_REQUEST(state, tournamentId) {
    state.series.loading = true
    state.series.error = null
    state.series.currentTournamentId = tournamentId
  },
  SERIES_SUCCESS(state, data) {
    if (data.data?.allSeries?.edges) {
      state.series.data = data.data.allSeries.edges.map(edge => edge.node)
    } else {
      state.series.data = []
    }
    state.series.loading = false
  },
  SERIES_ERROR(state, error) {
    state.series.error = error
    state.series.loading = false
  },
  SERIES_STATE_REQUEST(state, seriesId) {
    state.seriesState.loading = true
    state.seriesState.error = null
    state.seriesState.currentSeriesId = seriesId
  },
  SERIES_STATE_SUCCESS(state, data) {
    state.seriesState.data = data.data.seriesState
    state.seriesState.loading = false
  },
  SERIES_STATE_ERROR(state, error) {
    state.seriesState.error = error
    state.seriesState.loading = false
  }
}

export const actions = {
  async tournamentsRequest({ commit }, { name = '', titleId = '3' } = {}) {
    try {
      commit('TOURNAMENTS_REQUEST')
      const response = await axios.post('/league/tournaments', { name, titleId })
      commit('TOURNAMENTS_SUCCESS', response.data)
    } catch (error) {
      commit('TOURNAMENTS_ERROR', error?.response?.data?.error || 'Failed to fetch tournaments')
      throw error
    }
  },
  async seriesRequest({ commit }, { tournamentIds, tournamentIncludeChildren = true }) {
    try {
      commit('SERIES_REQUEST', Array.isArray(tournamentIds) ? tournamentIds[0] : tournamentIds)
      const response = await axios.post('/league/series', {
        startDate: '2022-01-01T00:00:00.000+05:30',
        endDate: '2025-06-06T23:59:59.999+05:30',
        tournamentIds: { tournamentIds },
        tournamentIncludeChildren
      })
      commit('SERIES_SUCCESS', response.data)
    } catch (error) {
      commit('SERIES_ERROR', error?.response?.data?.error || 'Failed to fetch tournament series')
      throw error
    }
  },
  async getSeriesState({ commit }, { seriesId, gameFinished, gameStarted }) {
    try {
      commit('SERIES_STATE_REQUEST', seriesId)
      const response = await axios.post('/league/series/state', {
        seriesId,
        gameFinished,
        gameStarted
      })
      commit('SERIES_STATE_SUCCESS', response.data)
      return response.data
    } catch (error) {
      commit('SERIES_STATE_ERROR', error?.response?.data?.error || 'Failed to fetch series state')
      throw error
    }
  }
}

export const getters = {
  tournamentsLoading: state => state.tournaments.loading,
  tournamentsError: state => state.tournaments.error,
  currentTournamentSeries: state => state.series.data,
  seriesLoading: state => state.series.loading,
  seriesError: state => state.series.error,
  currentTournamentId: state => state.series.currentTournamentId,
  currentSeriesState: state => state.seriesState.data,
  seriesStateLoading: state => state.seriesState.loading,
  seriesStateError: state => state.seriesState.error
}
