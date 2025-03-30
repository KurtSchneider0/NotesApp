import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { PutCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { v4 as uuid } from 'uuid'
import Note from './Note'


const client = new DynamoDBClient({})
const ddbClient = DynamoDBDocumentClient.from(client)

async function createNote(note: Note) {
  if (!note.id) {
    note.id = uuid()
  }
  const parameters = {
    TableName: process.env.PRODUCT_TABLE,
    Item: note
  }
  try {
    await ddbClient.send(new PutCommand(parameters))
    return note
  } catch (error) {
    console.error('Error: ', error)
    return null
  }
}

export default createNote