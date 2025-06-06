<template>
  <div>
    <LeagueSearch />
  </div>
</template>

<script>
import LeagueSearch from '@/components/League/LeagueSearch.vue'

export default {
  name: 'LeagueHome',
  components: {
    LeagueSearch
  },
  metaInfo() {
    return {
      title: 'League Tournament Search'
    }
  }
}
</script>
