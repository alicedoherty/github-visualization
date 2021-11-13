
# a script to do python based access to the github api
# step 4 - Let's store our data in a mongodb
# remember to pip install pymongo

from github import Github
# import json                 # for converting a dictionary to a string
# import pymongo              # for mongodb access

g = Github("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")

# Let's get the user object and build a data dictionary
usr = g.get_user()

print("user: " + usr.login)

# dct = {'user': usr.login,
#        'fullname': usr.name,
#        'location': usr.location,
#        'company': usr.company
#        }

# print ("dictionary is " + json.dumps(dct))

# # now let's store the dictionary in a mongodb

# # first we need to remove null fields from the dictionary, because
# # if we don't we'll end up with null fields in the db. This will cause us
# # lots of debugging problems later. The convention is only store actual data
# # in the database.

# for k, v in dict(dct).items():
#     if v is None:
#         del dct[k]

# print ("cleaned dictionary is " + json.dumps(dct))

# # now let's store the data.

# # Establish connection
# conn = "mongodb://localhost:27017"
# client = pymongo.MongoClient(conn)

# # Create a database
# db = client.classDB

# db.githubuser.insert_many([dct])
