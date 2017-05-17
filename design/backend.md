## Database
### Collections

* Users
* Polls
* Answers
* Users_answered

### Schema design

```json
user = {
  "id"              : "ObjectId",
  "name"            : "string",
  "username"        : "string",
  "email"           : "string",
  "password"        : "hash",
  "created_polls"   : "[poll refs]",
  "created_answers" : "[answer refs]"
}
```

```json
poll = {
  "id"          : "ObjectId",
  "question"    : "string",
  "answers"     : "[answer refs]",
  "votes"       : "number",
  "created_by"  : "user ref",
}
```

```json
answer = {
  "id"         : "ObjectId",
  "value"      : "string",
  "poll"       : "poll ref",
  "votes"      : "number",
  "created_by" : "user ref"
}
```

```json
users_answered = {
  "user"   : "user ref",
  "poll"   : "poll ref",
  "answer" : "answer ref"
}
```

***

## Routes


1. #### POST /users/register

  ##### Description
  Registration route

  ##### Request body
  ```json
  {
    "name"     : "string",
    "username" : "string",
    "email"    : "string",
    "password" : "string"
  }
  ```

  ##### Response body
  ```json
  {
    "status"  : "success | error",
    "error"   : "username already exists | bad request | server error" (if any)
  }
  ```
2. #### POST /users/login

   ##### Description
   Login Route

   ##### Request body
   ```json
   {
     "username" : "string",
     "password" : "string"
   }
   ```

   ##### Response body
   ```json
   {
     "status" : "success | error",
     "error"  : "username does not exist | password wrong | bad request | server error" (if any)
   }
   ```
3. #### GET /users/:username

   ##### Description
   Returns user profile

   ##### Response body
   ````json
   {
     "status"  : "success | error",
     "profile" : "{
       'name': 'String',
       'username': 'String',
       'email': 'String',
       'created_polls': '[{
         'question': 'string',
         'votes': 'number',
         'id': 'poll ref'
         }]'
     }",
     "error"   : "server error | bad request" (if any)
   }
   ````

4. #### GET /polls

   ##### Description
   Returns all polls

   ##### Response body
   ```json
   {
     "status" : "success | error",
     "polls"  : "List of polls",
     "error"  : "server error" (if any)
   }
   ```

   ##### Notes
   * *Poll structure*
   ```json
   {
     "id"          : "ObjectId",
     "question"    : "string",
     "answers"     : "[{
       'id'         : 'ObjectId',
       'value'      : 'string',
       'votes'      : 'number'
       'created_by' : {
         'username': 'string'
       }
      }]",
      "votes"      : "number",
      "created_by" : {
        "username" : "string"
      }
   }
   ```

5. #### POST /polls/create (only for authenticated users)

   ##### Description
   Creates a poll

   ##### Request body
   ```json
   {
     "question" : "string",
     "answers"  : "list of strings"
   }
   ```

   ##### Response body
   ```json
   {
     "status" : "success | error",
     "error"  : "user not authenticated | bad request | server error" (if any)
   }
   ```

6. #### POST /answers/create (only for authenticated users)

   ##### Description
   Creates a answer for a poll

   ##### Request body
   ```json
   {
     "poll_id" : "ObjectId",
     "answer"  : "string"
   }
   ```

   ##### Response body
   ```json
   {
     "status" : "success | error",
     "error"  : "user not authenticated | poll_id does not exist | bad request | server error" (if any)
   }
   ```

7. #### GET /polls/:pollid

  ##### Description
  Returns a poll for pollid

  ##### Response body
  ```json
  {
    "status"     : "success | error",
    "error"      : "bad request | server error" (if any),
    "poll"       : {
      "id"         : "ObjectId",
      "question"   : "string",
      "answers"  : "[{
        'id'         : 'ObjectId'
        'value'      : 'string',
        'votes'      : 'number'
        'created_by' : {
           'username': 'string'
         }
        }]",
        "votes"      : "number",
        "created_by" : {
          "username": "string"
        }
      },
    "answered_answer_id": "answer ref" (if user is authenticated)
  }
  ```

8. #### POST /answers/:answerid (only for authenticated users)

   ##### Description
   Vote on an answer

   ##### Response body
   ```json
   {
     "status" : "success | error",
     "error"  : "user not authenticated | bad request | server error" (if any)
   }
   ```
9. #### DELETE /polls/:pollid (only for authenticated users)

   ##### Description
   Delete a poll only if that poll is created by *that* authenticated user

   ##### Response body
   ```json
   {
     "status" : "success | error",
     "error"  : "user not authenticated | bad request | server error" (if any)
   }
   ```
10. #### DELETE /answers/:answerid (only for authenticated users)

   ##### Description
   Delete a answer only if that answer is created by *that* authenticated user

   ##### Response body
   ```json
   {
     "status" : "success | error",
     "error"  : "user not authenticated | bad request | server error" (if any)
   }
   ```
11. #### GET /users/logout

    ##### Description
    Logs out the user

    ##### Response body
    ```json
    {
      "status": "success"
    }
