import json
import mysql.connector

# MySQL connection setup
connection = mysql.connector.connect(
    host="localhost",       
    user="root",   # replace with MySQL username
    password="",  # Add MySQL password
    database="recipe_db"  # replace with database name
)

cursor = connection.cursor()

# Load the cleaned JSON data
with open(r"backend\data\recipes.json", "r", encoding="utf-8") as f:   #if any errors, try replacing with absolute path
    recipes = json.load(f)

# SQL insert query
query = """
    INSERT INTO recipes (
        id, cuisine, title, rating, prep_time, cook_time, total_time, 
        description, nutrients, serves
    ) VALUES (
        %(id)s, %(cuisine)s, %(title)s, %(rating)s, %(prep_time)s, %(cook_time)s, %(total_time)s,
        %(description)s, %(nutrients)s, %(serves)s
    )
"""

# Insert each recipe
for recipe in recipes:
    # Convert nutrients dict to JSON string for MySQL JSON field
    recipe['nutrients'] = json.dumps(recipe['nutrients']) if recipe['nutrients'] else None
    cursor.execute(query, recipe)

# Commit and close
connection.commit()
cursor.close()
connection.close()

print("Recipes inserted successfully into the MySQL database.")