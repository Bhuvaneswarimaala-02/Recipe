from fastapi import FastAPI, Query
from typing import Optional, List
import mysql.connector
import json
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MySQL connection setup
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "Bhuvan24",
    "database": "recipe_db"
}

# Function to get DB connection
def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.get("/")
def hello():
    return "WORKING"

# API Endpoint 1: Get All Recipes(pagination and Sorted - based on rating)
@app.get("/api/recipes")
def get_all_recipes(page: int = 1, limit: int = 10):
    offset = (page - 1) * limit
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # Get total number of records
    cursor.execute("SELECT COUNT(*) as total FROM recipes")
    total = cursor.fetchone()['total']

    # Get paginated recipes
    query = """
        SELECT * FROM recipes
        ORDER BY rating DESC
        LIMIT %s OFFSET %s
    """
    cursor.execute(query, (limit, offset))
    recipes = cursor.fetchall()
    cursor.close()
    conn.close()

    # Parse nutrients JSON
    for recipe in recipes:
        if recipe['nutrients']:
            recipe['nutrients'] = json.loads(recipe['nutrients'])

    # Wrap response with pagination info
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": recipes
    }

# API Endpoint 2: Search Recipes for any field(pagination implemented for search results also)
@app.get("/api/recipes/search")
def search_recipes(
    calories: Optional[str] = None,
    title: Optional[str] = None,
    cuisine: Optional[str] = None,
    total_time: Optional[str] = None,
    rating: Optional[str] = None,
    page: int = 1,
    limit: int = 15,
):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    filters = []
    params = []

    # Dynamic filter construction
    if calories:
        operator = extract_operator(calories)
        filters.append(f"JSON_EXTRACT(nutrients, '$.calories') {operator} %s")
        params.append(float(strip_operator(calories)))

    if total_time:
        operator = extract_operator(total_time)
        filters.append(f"total_time {operator} %s")
        params.append(int(strip_operator(total_time)))

    if rating:
        operator = extract_operator(rating)
        filters.append(f"rating {operator} %s")
        params.append(float(strip_operator(rating)))

    if title:
        filters.append("title LIKE %s")
        params.append(f"%{title}%")

    if cuisine:
        filters.append("cuisine = %s")
        params.append(cuisine)

    where_clause = " AND ".join(filters)
    base_query = "FROM recipes"
    if where_clause:
        base_query += " WHERE " + where_clause

    # Get total matching results
    total_query = f"SELECT COUNT(*) as total {base_query}"
    cursor.execute(total_query, tuple(params))
    total = cursor.fetchone()["total"]

    # Get paginated filtered results
    offset = (page - 1) * limit
    data_query = f"SELECT * {base_query} ORDER BY rating DESC LIMIT %s OFFSET %s"
    full_params = params + [limit, offset]
    cursor.execute(data_query, tuple(full_params))
    results = cursor.fetchall()

    # Parse nutrients JSON
    for r in results:
        if r["nutrients"]:
            r["nutrients"] = json.loads(r["nutrients"])

    cursor.close()
    conn.close()

    return {
        "page": page,
        "limit": limit,
        "total": total,
        "data": results,
    }

# Helpers for operator parsing
def extract_operator(val: str) -> str:
    if val.startswith(">="): return ">="
    if val.startswith("<="): return "<="
    if val.startswith(">"): return ">"
    if val.startswith("<"): return "<"
    if val.startswith("="): return "="
    raise ValueError("Invalid operator format")

def strip_operator(val: str) -> str:
    return val.lstrip("<>=").strip()
