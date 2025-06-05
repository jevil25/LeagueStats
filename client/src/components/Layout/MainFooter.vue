<template>
  <footer class="pb-4 pt-20 text-blue-200">
    <p
      class="horizontal-center pointer-events-none absolute text-center text-xxs leading-tight"
      style="color: #5d80af"
    >
      LeagueStats.gg isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot
      Games or anyone officially involved in producing or managing Riot Games properties.
      <br />Riot Games, and all associated properties are trademarks or registered trademarks of
      Riot Games, Inc.
    </p>
  </footer>
</template>

<style scoped>
.github svg {
  width: 22px;
  height: 22px;
  transform-origin: bottom left;
  transition: 0.2s ease-in-out;
}

.github:hover svg {
  width: 24px;
  height: 24px;
  transform: rotate(-5deg);
}

.github:hover span {
  color: #ebf8ff;
}
</style>
