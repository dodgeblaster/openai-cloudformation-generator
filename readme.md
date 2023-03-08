# ChatGPT Cloudformation Generation

## Endpoint

https://nds06wx7zd.execute-api.us-east-1.amazonaws.com/Prod/

## Description

This app allows you to

-   click on any CloudFormation resource
-   This will trigger a lambda that asks ChatGPT to write an example template for that resource
-   Will save answer into a DynamoDB table for quick response to repeat questions
-   Returns answer
