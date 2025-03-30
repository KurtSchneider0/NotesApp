import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { ScanCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const ddbClient = DynamoDBDocumentClient.from(client)

async function listNotes() {
  const parameters = {
    TableName: process.env.PRODUCT_TABLE
  }
  try {
    const data = await ddbClient.send(new ScanCommand(parameters))
    return data.Items || []
  } catch (error) {
    console.error('Error: ', error)
    return null
  }
}

export default listNotes