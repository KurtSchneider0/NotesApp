import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { GetCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const ddbClient = DynamoDBDocumentClient.from(client)

async function getNote(id: string) {
  const parameters = {
    TableName: process.env.PRODUCT_TABLE,
    Key: { id: id }
  }
  try {
    const { Item } = await ddbClient.send(new GetCommand(parameters))
    return Item
  } catch (error) {
    console.error('Error: ', error)
    return null
  }
}

export default getNote
