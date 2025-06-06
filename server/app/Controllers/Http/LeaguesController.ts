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
    const { startDate = '2022-01-01T00:00:00.000+05:30', endDate } = request.body()

    const query = `
      query GetHistoricalSeries($windowStartTime: String!, $windowEndTime: String!, $first: Int) {
        allSeries(
          filter: {
            startTimeScheduled: { gte: $windowStartTime, lte: $windowEndTime }
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
            windowEndTime: endDate || new Date().toISOString(),
            first: 10
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
}
