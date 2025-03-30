import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as appsync from 'aws-cdk-lib/aws-appsync';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import * as path from 'path';

export class NotesAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'notes-user-pool', {
      selfSignUpEnabled: true,
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE
      },
      autoVerify: {
        email: true
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true
        }
      }
    })

    const userPoolClient = new cognito.UserPoolClient(this, "notes-user-pool-client", {
      userPool
    })

    const api = new appsync.GraphqlApi(this, 'notes-api', {
      name: 'notes-api',
      logConfig: {
        fieldLogLevel: appsync.FieldLogLevel.ALL,
      },
      definition: appsync.Definition.fromFile(path.join(__dirname, '..', '/graphql/schema.graphql')),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        },
        additionalAuthorizationModes: [{
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          }
        }]
      },
    })

    const notesTable = new ddb.Table(this, 'CDKNotesTable', {
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: 'id',
        type: ddb.AttributeType.STRING,
      },
    })

    const notesLambda = new lambda.Function(this, "lambdaId", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: "main.handler",
      environment: {
        PRODUCT_TABLE: notesTable.tableName,
      },
    })

    const lambdaDs = api.addLambdaDataSource('notesLambdaDatasource', notesLambda)

    notesTable.grantFullAccess(notesLambda)
    notesLambda.addEnvironment('PRODUCT_TABLE', notesTable.tableName)

    lambdaDs.createResolver("ListNotesResolver", {
      typeName: "Query",
      fieldName: "listNotes"
    })
    lambdaDs.createResolver("GetNoteResolver", {
      typeName: "Query",
      fieldName: "getNote"
    })

    lambdaDs.createResolver("NewNoteResolver", {
      typeName: "Mutation",
      fieldName: "newNote"
    })

    lambdaDs.createResolver("DeleteNoteResolver", {
      typeName: "Mutation",
      fieldName: "deleteNote"
    })
  }
}
