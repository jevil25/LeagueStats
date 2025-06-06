import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class LeaguesController {
  /**
   * POST - Search for league tournaments
   */
  public async tournaments({ request, response }: HttpContextContract) {
    const { name = '', titleId = '3' } = request.body()

    const query = `
      query GetTournamentsFilter($name: StringFilter, $titleId: ID, $first: Int) {
        tournaments(
          filter: {name: $name, titleId: $titleId}
          first: $first
        ) {
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
          totalCount
          edges {
            cursor
            node {
              id
              name
              logoUrl
            }
          }
        }
      }
    `

    try {
      const fetchResponse = await fetch('https://api.grid.gg/central-data/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Env.get('GRID_API_KEY', ''),
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en;q=0.6',
        },
        body: JSON.stringify({
          operationName: 'GetTournamentsFilter',
          variables: {
            name: { contains: name },
            titleId,
            first: 20
          },
          query
        })
      })

      const data = await fetchResponse.json()
      return data
    } catch (error) {
      console.error('League tournaments search error:', error)
      return response.status(500).json({ 
        error: 'Failed to fetch tournament data',
        details: error.message 
      })
    }
  }

  /**
   * POST - Search for league matches and tournament series
   */
  public async series({ request, response }: HttpContextContract) {
    const { 
      startDate = '2022-01-01T00:00:00.000+05:30', 
      endDate = new Date().toISOString(),
      tournamentIds = [],
      tournamentIncludeChildren = true 
    } = request.body()

    // Validate and format tournament IDs
    if (!tournamentIds || !tournamentIds.tournamentIds || tournamentIds.tournamentIds.length === 0) {
      return response.status(400).json({
        error: 'At least one tournament ID is required'
      })
    }

    // Ensure we have valid tournament IDs and convert them to strings
    const formattedIds = tournamentIds.tournamentIds.map(id => id.toString().trim()).filter(id => id);

    const query = `
      query GetHistoricalSeries($windowStartTime: String!, $windowEndTime: String!, $first: Int, $tournamentIds: [ID!], $tournamentIncludeChildren: Boolean) {
        allSeries(
          filter: {
            startTimeScheduled: { gte: $windowStartTime, lte: $windowEndTime }
            tournament: {
              id: { in: $tournamentIds }
              includeChildren: { equals: $tournamentIncludeChildren }
            }
          }
          first: $first
          orderBy: StartTimeScheduled
          orderDirection: DESC
        ) {
          totalCount
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
          edges {
            node {
              id
              type
              title {
                name
                nameShortened
              }
              tournament {
                name
              }
              startTimeScheduled
              format {
                nameShortened
              }
              teams {
                baseInfo {
                  name
                  logoUrl
                  id
                  externalLinks {
                    dataProvider {
                      name
                    }
                    externalEntity {
                      id
                    }
                  }
                }
              }
              productServiceLevels {
                productName
                serviceLevel
              }
              externalLinks {
                dataProvider {
                  name
                }
                externalEntity {
                  id
                }
              }
            }
          }
        }
      }
    `

    try {
      const fetchResponse = await fetch('https://api.grid.gg/central-data/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Env.get('GRID_API_KEY', ''),
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en;q=0.6',
        },
        body: JSON.stringify({
          operationName: 'GetHistoricalSeries',
          variables: {
            windowStartTime: startDate,
            windowEndTime: endDate,
            first: 10,
            tournamentIds: formattedIds,
            tournamentIncludeChildren: tournamentIncludeChildren
          },
          query
        })
      })

      const data = await fetchResponse.json()
      return data
    } catch (error) {
      console.error('League search error:', error)
      return response.status(500).json({ 
        error: 'Failed to fetch league data',
        details: error.message 
      })
    }
  }

  /**
   * POST - Get detailed state data for a specific series
   */
  public async seriesState({ request, response }: HttpContextContract) {
    const { 
      seriesId,
      gameFinished,
      gameStarted
    } = request.body()

    if (!seriesId) {
      return response.status(400).json({
        error: 'Series ID is required'
      })
    }

    const query = `
      query SeriesState($seriesID: ID!, $gameFinished: Boolean, $gameStarted: Boolean) {
        seriesState(id: $seriesID) {
          version
          id
          format
          started
          finished
          valid
          updatedAt
          startedAt
          teams {
            id
            name
            score
            won
          }
          games(filter: { finished: $gameFinished, started: $gameStarted }) {
            id
            sequenceNumber
            type
            started
            finished
            paused
            startedAt
            teams {
              id
              name
              side
              won
              score
              money
              loadoutValue
              netWorth
              kills
              killAssistsReceived
              killAssistsGiven
              teamkills
              teamkillAssistsReceived
              teamkillAssistsGiven
              selfkills
              deaths
              firstKill
              structuresDestroyed
              structuresCaptured
              killAssistsReceivedFromPlayer {
                id
                playerId
                killAssistsReceived
              }
              objectives {
                id
                type
                completedFirst
                completionCount
              }
              unitKills {
                id
                unitName
                count
              }
              players {
                id
                name
                participationStatus
                money
                loadoutValue
                netWorth
                kills
                killAssistsReceived
                killAssistsGiven
                deaths
                firstKill
                structuresDestroyed
              }
              multikills {
                id
                numberOfKills
                count
              }
            }
            externalLinks {
              dataProvider {
                name
              }
              externalEntity {
                id
              }
            }
            map {
              id
              name
              bounds {
                min {
                  x
                  y
                }
                max {
                  x
                  y
                }
              }
            }
            titleVersion {
              name
            }
            clock {
              id
              type
              ticking
              ticksBackwards
              currentSeconds
            }
            nonPlayerCharacters {
              id
              type
              side
              alive
            }
            structures {
              id
              type
              side
              teamId
              currentHealth
              maxHealth
              destroyed
            }
            duration
          }
          title {
            nameShortened
          }
          duration
        }
      }
    `

    try {
      const fetchResponse = await fetch('https://api.grid.gg/live-data-feed/series-state/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': Env.get('GRID_API_KEY', ''),
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en;q=0.6',
        },
        body: JSON.stringify({
          operationName: 'SeriesState',
          variables: {
            seriesID: seriesId,
            gameFinished,
            gameStarted
          },
          query
        })
      })

      const data = await fetchResponse.json()
      return data
    } catch (error) {
      console.error('Series state fetch error:', error)
      return response.status(500).json({ 
        error: 'Failed to fetch series state data',
        details: error.message 
      })
    }
  }
}
