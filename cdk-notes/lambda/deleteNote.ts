import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({}) 
const ddbClient = DynamoDBDocumentClient.from(client)


async function deleteNote(id: string) {
  const parameters = {
    TableName: process.env.PRODUCT_TABLE,
    Key: {
      id: id
    }
  }
  try {
    await ddbClient.send(new DeleteCommand(parameters))
    return id
  } catch (error) {
    console.error('Error: ', error)
    return null
  }
}

export default deleteNote